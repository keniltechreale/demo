import { Response } from 'express';
import * as Utils from '../../lib/utils';
import EmergencyServices from '../../services/users/emergencycontact.service';
import { IRequest } from '../../lib/common.interface';
import { IEmergencyData } from '../../middleware/validation.middleware';

export default new (class EmergencyContactController {
  addEmergencyContact = (req: IRequest, res: Response): void => {
    try {
      const body: IEmergencyData = req.body as IEmergencyData;

      EmergencyServices.addEmergencyContact(body, req.user.id)
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

  resendOtp = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;
      const args: Record<string, unknown> = {
        country_code: body.country_code,
        phone_number: body.phone_number,
        type: req.params.type,
      };
      EmergencyServices.resendOtp(args, req.user.id)
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
        country_code: body.country_code,
        phone_number: body.phone_number,
        otp: body.otp,
      };
      EmergencyServices.verifyOtp(args, req.user.id)
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

  viewEmergencyContact = (req: IRequest, res: Response): void => {
    try {
      const args = {
        userId: req.user.id,
      };
      EmergencyServices.getEmergencyContactById(args)
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

  updateEmergencyContact = (req: IRequest, res: Response): void => {
    try {
      const body: IEmergencyData = req.body as IEmergencyData;

      EmergencyServices.updateEmergencyContact(body, req.params.id, req.user.id)
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

  deleteEmergencyContact = (req: IRequest, res: Response): void => {
    try {
      const args = {
        id: req.params.id,
      };
      EmergencyServices.deleteEmergencyContact(args, req.user.id)
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
