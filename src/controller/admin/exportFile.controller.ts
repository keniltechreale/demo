import { Response } from 'express';
import * as Utils from '../../lib/utils';
import ExportFilesService from '../../services/admin/exportFile.service';
import { IRequest, ISearch } from '../../lib/common.interface';
import paginationConfig from '../../config/pagination.config';
import fs from 'fs';
import { format } from '@fast-csv/format';
import ExcelJS from 'exceljs';

export default new (class ExportFilesController {
  ExportCSVFiles = async (req: IRequest, res: Response) => {
    try {
      const args: ISearch = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || paginationConfig.PER_PAGE,
        search: (req.query.search as string) || '',
        status: (req.query.status as string) || '',
      };

      // Fetch user data from the service
      const result = await ExportFilesService.exportCSVFiles(args, req.params.type);

      const filePath = 'users.csv';
      const writableStream = fs.createWriteStream(filePath);

      const csvStream = format({ headers: true });
      csvStream.pipe(writableStream);

      // Writing user data to CSV
      result.details.forEach((user: any) => {
        csvStream.write(user);
      });

      csvStream.end();

      writableStream.on('finish', () => {
        res.download(filePath, 'csvFile.csv', (err?: NodeJS.ErrnoException) => {
          if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file');
            return;
          }
          fs.unlinkSync(filePath); // Delete file after download
        });
      });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  ExportExcelFiles = async (req: IRequest, res: Response) => {
    try {
      const args: ISearch = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || paginationConfig.PER_PAGE,
        search: (req.query.search as string) || '',
        status: (req.query.status as string) || '',
      };

      const result = await ExportFilesService.exportCSVFiles(args, req.params.type);

      // Create an Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Users');

      // Dynamically generate the headers from the keys of the first object
      if (result.details.length > 0) {
        const headers = Object.keys(result.details[0]).map((key) => ({
          header: key.replace(/_/g, ' ').toUpperCase(), // Convert snake_case to readable format
          key,
          width: 20, // Adjust width as per your needs
        }));

        worksheet.columns = headers;

        // Add data to worksheet
        result.details.forEach((user: Record<string, any>) => {
          worksheet.addRow(user);
        });
      }

      // Set response headers for Excel file download
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', 'attachment; filename=excelFile.xlsx');

      // Write the workbook to the response stream
      await workbook.xlsx.write(res);
      res.end();
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };
})();
