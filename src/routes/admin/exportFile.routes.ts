import express from 'express';
import ExportFilesController from '../../controller/admin/exportFile.controller';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();

router.get('/csv/:type', AuthGuard.verifyAdminAccessToken, ExportFilesController.ExportCSVFiles);
router.get(
  '/excel/:type',
  AuthGuard.verifyAdminAccessToken,
  ExportFilesController.ExportExcelFiles,
);

export default router;
