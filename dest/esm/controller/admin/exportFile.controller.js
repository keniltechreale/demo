var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from '../../lib/utils';
import ExportFilesService from '../../services/admin/exportFile.service';
import paginationConfig from '../../config/pagination.config';
import fs from 'fs';
import { format } from '@fast-csv/format';
import ExcelJS from 'exceljs';
export default new (class ExportFilesController {
    constructor() {
        this.ExportCSVFiles = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const args = {
                    page: Number(req.query.page) || 1,
                    limit: Number(req.query.limit) || paginationConfig.PER_PAGE,
                    search: req.query.search || '',
                    status: req.query.status || '',
                };
                // Fetch user data from the service
                const result = yield ExportFilesService.exportCSVFiles(args, req.params.type);
                const filePath = 'users.csv';
                const writableStream = fs.createWriteStream(filePath);
                const csvStream = format({ headers: true });
                csvStream.pipe(writableStream);
                // Writing user data to CSV
                result.details.forEach((user) => {
                    csvStream.write(user);
                });
                csvStream.end();
                writableStream.on('finish', () => {
                    res.download(filePath, 'csvFile.csv', (err) => {
                        if (err) {
                            console.error('Error downloading file:', err);
                            res.status(500).send('Error downloading file');
                            return;
                        }
                        fs.unlinkSync(filePath); // Delete file after download
                    });
                });
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        });
        this.ExportExcelFiles = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const args = {
                    page: Number(req.query.page) || 1,
                    limit: Number(req.query.limit) || paginationConfig.PER_PAGE,
                    search: req.query.search || '',
                    status: req.query.status || '',
                };
                const result = yield ExportFilesService.exportCSVFiles(args, req.params.type);
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
                    result.details.forEach((user) => {
                        worksheet.addRow(user);
                    });
                }
                // Set response headers for Excel file download
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=excelFile.xlsx');
                // Write the workbook to the response stream
                yield workbook.xlsx.write(res);
                res.end();
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        });
    }
})();
//# sourceMappingURL=exportFile.controller.js.map