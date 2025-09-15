import { Request, Response } from 'express';
import * as Utils from '../../lib/utils';
import AdminUserService from '../../services/admin/adminuser.service';
import {
  IAdminLoginData,
  ForgotPasswordData,
  ResetPasswordData,
} from '../../middleware/validation.middleware';
import { IRequest } from '../../lib/common.interface';

export default new (class AuthController {
  login = (req: Request, res: Response): void => {
    try {
      const body = req.body as Record<string, string>;
      const args: IAdminLoginData = {
        email: body.email,
        password: body.password,
      };
      AdminUserService.login(args)
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
  me = (req: IRequest, res: Response) => {
    const args = {
      userId: req.admin.id,
    };
    AdminUserService.me(args)
      .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
      .catch((err) =>
        res
          .status(Utils.getErrorStatusCode(err))
          .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
      );
  };
  forgotPassword = (req: Request, res: Response): void => {
    try {
      const body = req.body as ForgotPasswordData;
      const args: ForgotPasswordData = {
        email: body.email,
      };
      AdminUserService.forgotPassword(args)
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
  verifyOtp = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;
      const args: Record<string, unknown> = {
        otp: body.otp,
      };
      AdminUserService.verifyOtp(args, req.admin.id)
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
  resetPassword = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as ResetPasswordData;
      const args: Record<string, string> = {
        password: body.password,
      };
      AdminUserService.resetPassword(args, req.admin.id)
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
