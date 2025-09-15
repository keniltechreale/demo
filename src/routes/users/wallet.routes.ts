import express from 'express';
import WalletsController from '../../controller/users/wallet.controller';
import * as AuthGuard from '../../middleware/authGard';
import ValidationMiddleware from '../../middleware/validation.middleware';

const router = express.Router();

router.get('/', AuthGuard.verifyUserAccessToken, WalletsController.viewWallets);

router.get('/select_user/:role', AuthGuard.verifyUserAccessToken, WalletsController.userSearch);

router.post(
  '/transfer/:user_id',
  AuthGuard.verifyUserAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.TransferFunds),
  WalletsController.transferFunds,
);

router.post('/payment/:ride_id', AuthGuard.verifyUserAccessToken, WalletsController.walletPayment);

router.post(
  '/tip/payment/:ride_id',
  AuthGuard.verifyUserAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.TransferFunds),
  WalletsController.WalletTipPayment,
);

export default router;
