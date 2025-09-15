import { Request, Response } from 'express';
import * as Utils from '../../lib/utils';
import UserService from '../../services/users/userAuth.service';
import { VerifyOtpData, ForgotPasswordData } from '../../middleware/validation.middleware';
import { IRequest } from '../../lib/common.interface';

export default new (class AuthController {
  userRegister = (req: Request, res: Response): void => {
    try {
      const body = req.body as Record<string, string>;
      UserService.register(body, req.params.role)
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

  resendOtp = (req: Request, res: Response): void => {
    try {
      const body = req.body as Record<string, string>;
      const args = {
        country_code: body.country_code,
        phone_number: body.phone_number,
        type: req.params.type,
      };
      UserService.resendOtp(args)
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

  verifyOtp = (req: Request, res: Response): void => {
    try {
      const body = req.body as Record<string, string>;
      const args: VerifyOtpData = {
        country_code: body.country_code,
        phone_number: body.phone_number,
        otp: body.otp,
      };
      UserService.verifyOtp(args, req.params.type)
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

  login = (req: Request, res: Response): void => {
    try {
      const body = req.body as Record<string, string>;
      const args = {
        country_code: body.country_code,
        phone_number: body.phone_number,
        fcm_token: body.fcm_token,
      };
      UserService.login(args, req.params.role)
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
      userId: req.user.id,
    };
    UserService.me(args)
      .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
      .catch((err) =>
        res
          .status(Utils.getErrorStatusCode(err))
          .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
      );
  };

  changePassword = (req: IRequest, res: Response) => {
    try {
      const body = req.body as Record<string, unknown>;
      const args: Record<string, unknown> = {
        oldPassword: body.oldPassword,
        newPassword: body.newPassword,
      };
      UserService.changePassword(args, req.user.id)
        .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
        .catch((err) =>
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
        );
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };
  updateProfile = (req: IRequest, res: Response) => {
    const body = req.body as Record<string, unknown>;

    UserService.updateProfile(body, req.user.id)
      .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
      .catch((err) =>
        res
          .status(Utils.getErrorStatusCode(err))
          .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
      );
  };

  ForgotPassword = (req: Request, res: Response) => {
    const body = req.body as Record<string, string>;
    const args: ForgotPasswordData = {
      email: body.email,
    };
    UserService.forgotPassword(args)
      .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
      .catch((err) =>
        res
          .status(Utils.getErrorStatusCode(err))
          .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
      );
  };

  ResetPasswords = (req: IRequest, res: Response) => {
    const body = req.body as Record<string, unknown>;
    const args: Record<string, unknown> = {
      password: body.password,
    };
    UserService.ResetPassword(args, req.user.id)
      .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
      .catch((err) =>
        res
          .status(Utils.getErrorStatusCode(err))
          .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
      );
  };

  deleteProfile = (req: IRequest, res: Response) => {
    UserService.deleteUser(req.user.id)
      .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
      .catch((err) =>
        res
          .status(Utils.getErrorStatusCode(err))
          .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
      );
  };

  Logout = (req: IRequest, res: Response) => {
    UserService.Logout(req.user.id)
      .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
      .catch((err) =>
        res
          .status(Utils.getErrorStatusCode(err))
          .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
      );
  };
})();
