import express from 'express';
import WalletsController from '../../controller/admin/wallet.controller';
import * as AuthGuard from '../../middleware/authGard';
import ValidationMiddleware from '../../middleware/validation.middleware';

const router = express.Router();

router.get('/:user_id', AuthGuard.verifyAdminAccessToken, WalletsController.viewWallets);

router.post(
  '/transfer/:user_id',
  AuthGuard.verifyAdminAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.TransferFunds),
  WalletsController.AddedToWallet,
);

router.post(
  '/deduction/:user_id',
  AuthGuard.verifyAdminAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.TransferFunds),
  WalletsController.RemovedFromWAllet,
);

export default router;
