import { Response } from 'express';
import * as Utils from '../../lib/utils';
import BankAccountService from '../../services/users/bankAccount.service';
import { IRequest } from '../../lib/common.interface';

export default new (class BankAccountsController {
  addBankAccounts = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;
      console.log(req.user);

      BankAccountService.addBankAccounts(body, req.user)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  viewBankAccounts = (req: IRequest, res: Response) => {
    try {
      BankAccountService.getBankAccounts(req.user.id)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  updateBankAccounts = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;
      BankAccountService.updateBankAccounts(body, req.params.bankAccounts_id)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  deleteBankAccounts = (req: IRequest, res: Response): void => {
    try {
      const args = {
        bankAccountsId: req.params.bankAccounts_id,
      };
      BankAccountService.deleteBankAccounts(args)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  CashOut = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;

      BankAccountService.cashOut(body, req.user)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };
})();
