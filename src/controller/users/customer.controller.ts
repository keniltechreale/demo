import { Response } from 'express';
import * as Utils from '../../lib/utils';
import CustomerServices from '../../services/users/customer.service';
import { IRequest } from '../../lib/common.interface';

export default new (class DriverController {
  ViewDashboard = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as { lat: number; long: number };

      CustomerServices.ViewDashboard(body)
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

  // AvailableVehicleTypes = (req: IRequest, res: Response): void => {
  //   try {
  //     CustomerServices.AvailableVehicleTypes(req.params.ride_id)
  //       .then((result) => {
  //         res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
  //       })
  //       .catch((err) => {
  //         res
  //           .status(Utils.getErrorStatusCode(err))
  //           .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
  //       });
  //   } catch (err) {
  //     res
  //       .status(Utils.getErrorStatusCode(err))
  //       .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
  //   }
  // };

  AvailableVehicleCategories = (req: IRequest, res: Response): void => {
    try {
      CustomerServices.AvailableVehicleCategories(req.params.ride_id)
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

  selectDrivers = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as { driverIds: unknown }; // Specify the expected structure
      if (!Array.isArray(body.driverIds) || !body.driverIds.every((id) => typeof id === 'number')) {
        Utils.throwError('Invalid driverIds');
      }

      const args = {
        driverIds: body.driverIds as number[],
      };
      CustomerServices.selectDrivers(req.params.ride_id, args)
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
  addInstructions = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;
      CustomerServices.addInstructions(body, req.params.ride_id)
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
  VerifyCoupon = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;

      CustomerServices.verifyCoupon(body, req.params.ride_id, req.params.type)
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
  redeemCoupon = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;

      CustomerServices.redeemCoupons(body, req.params.ride_id)
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
