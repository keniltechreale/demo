import express from 'express';
import WalletsController from '../../controller/admin/wallet.controller';
import * as AuthGuard from '../../middleware/authGard';

const router = express.Router();

router.get('/history', AuthGuard.verifyAdminAccessToken, WalletsController.PaymentHistory);

export default router;
