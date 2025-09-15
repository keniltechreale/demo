import { Response } from 'express';
import * as Utils from '../../lib/utils';
import VehicleServices from '../../services/users/vehicle.service';
import { IRequest } from '../../lib/common.interface';
import { IVehicleData } from '../../middleware/validation.middleware';

export default new (class VehicleController {
  addVehicle = (req: IRequest, res: Response): void => {
    try {
      const body: IVehicleData = req.body as IVehicleData;

      VehicleServices.addVehicles(body, req.user.id)
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

  viewVehicles = (req: IRequest, res: Response): void => {
    try {
      const args = {
        userId: req.user.id,
      };
      VehicleServices.getVehiclesById(args)
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

  updateVehicle = (req: IRequest, res: Response): void => {
    try {
      const body: IVehicleData = req.body as IVehicleData;

      VehicleServices.updateVehicles(body, req.params.vehicle_id, req.files)
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

  deleteVehicle = (req: IRequest, res: Response): void => {
    try {
      const args = {
        vehicleId: req.params.vehicle_id,
      };
      VehicleServices.deleteVehicles(args)
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
