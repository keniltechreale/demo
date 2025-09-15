import express from 'express';
import BankAccountsController from '../../controller/users/bankaccount.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();

router.post(
  '/',
  AuthGuard.verifyUserAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.BankAccount),
  BankAccountsController.addBankAccounts,
);

router.get('/', AuthGuard.verifyUserAccessToken, BankAccountsController.viewBankAccounts);

router.patch(
  '/:bankAccounts_id',
  AuthGuard.verifyUserAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.BankAccount),
  BankAccountsController.updateBankAccounts,
);

router.delete(
  '/:bankAccounts_id',
  AuthGuard.verifyUserAccessToken,
  BankAccountsController.deleteBankAccounts,
);

router.post(
  '/cashout',
  AuthGuard.verifyUserAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.TransferFunds),
  BankAccountsController.CashOut,
);

export default router;
