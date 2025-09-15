import express from 'express';
import CashoutRequestController from '../../controller/admin/cashoutrequest.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
import multer from 'multer';
import { singleFileUpload } from '../../lib/fileUpload.utils';
const storage = multer.memoryStorage(); // Use memory storage for simplicity; adjust as needed
const upload = multer({ storage: storage });
const router = express.Router();
router.get('/', AuthGuard.verifyAdminAccessToken, CashoutRequestController.viewAllCashoutRequestServices);
router.patch('/:cashoutRequest_id', upload.single('payment_proof'), singleFileUpload, ValidationMiddleware.validate(ValidationMiddleware.schema.CashoutRequest), CashoutRequestController.updateCashoutRequestService);
export default router;
//# sourceMappingURL=cashoutrequest.routes.js.map