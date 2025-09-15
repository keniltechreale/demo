"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils = __importStar(require("../../lib/utils"));
const exportFile_service_1 = __importDefault(require("../../services/admin/exportFile.service"));
const pagination_config_1 = __importDefault(require("../../config/pagination.config"));
const fs_1 = __importDefault(require("fs"));
const format_1 = require("@fast-csv/format");
const exceljs_1 = __importDefault(require("exceljs"));
exports.default = new (class ExportFilesController {
    constructor() {
        this.ExportCSVFiles = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const args = {
                    page: Number(req.query.page) || 1,
                    limit: Number(req.query.limit) || pagination_config_1.default.PER_PAGE,
                    search: req.query.search || '',
                    status: req.query.status || '',
                };
                // Fetch user data from the service
                const result = yield exportFile_service_1.default.exportCSVFiles(args, req.params.type);
                const filePath = 'users.csv';
                const writableStream = fs_1.default.createWriteStream(filePath);
                const csvStream = (0, format_1.format)({ headers: true });
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
                        fs_1.default.unlinkSync(filePath); // Delete file after download
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
                    limit: Number(req.query.limit) || pagination_config_1.default.PER_PAGE,
                    search: req.query.search || '',
                    status: req.query.status || '',
                };
                const result = yield exportFile_service_1.default.exportCSVFiles(args, req.params.type);
                // Create an Excel workbook and worksheet
                const workbook = new exceljs_1.default.Workbook();
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