import { Response } from 'express';
import * as Utils from '../../lib/utils';
import UserService from '../../services/admin/userdetails.service';
import { IRequest, ISearch } from '../../lib/common.interface';
// import { IVehicleData } from '../../middleware/validation.middleware';
import paginationConfig from '../../config/pagination.config';

export default new (class UserDetailsController {
  addDriverUser = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;
      const args: Record<string, unknown> = {
        name: body.name,
        email: body.email,
        country_code: body.country_code,
        phone_number: body.phone_number,
        referral_code: body.referral_code,
        registeredBy: 'admin',
        role: 'driver',
      };
      UserService.addDriver(args)
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

  // addVehicle = (req: IRequest, res: Response): void => {
  //   try {
  //     const body = req.body as Record<string, string>;
  //     const args: IVehicleData = {
  //       type: body.type,
  //       vehicle_platenumber: body.vehicle_platenumber,
  //       vehicle_color: body.vehicle_color,
  //       vehicle_exterior_image: body.vehicle_exterior_image,
  //       vehicle_interior_image: body.vehicle_interior_image,
  //       driving_license: body.driving_license,
  //       ownership_certificate: body.ownership_certificate,
  //       government_issuedID: body.government_issuedID,
  //       roadworthiness: body.roadworthiness,
  //       inspection_report: body.inspection_report,
  //       LASSRA_LASDRI_card: body.LASSRA_LASDRI_card,
  //     };
  //     UserService.addDriverVehicle(args, req.params.user_id)
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

  userCount = (req: IRequest, res: Response): void => {
    try {
      UserService.userCount()
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

  usersList = (req: IRequest, res: Response): void => {
    try {
      const args: ISearch = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || paginationConfig.PER_PAGE,
        search: (req.query.search as string) || '',
        status: req.query.status as string,
      };
      UserService.userList(args, req.params.role)
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

  userDetails = (req: IRequest, res: Response): void => {
    try {
      const args = {
        userId: req.params.user_id,
      };
      UserService.userDetails(args)
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
      const body = req.body as Record<string, unknown>;
      UserService.updateVehicle(body, req.params.vehicle_id)
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

  updateUser = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;

      const args = {
        status: body.status,
      };
      UserService.updateUser(args, req.params.user_id)
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
      UserService.viewVehicle(req.params.user_id)
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

  paymentHistory = (req: IRequest, res: Response): void => {
    try {
      const args: ISearch = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };
      UserService.getPaymentHistory(args, req.params.user_id)
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

  deleteUser = (req: IRequest, res: Response): void => {
    try {
      const args: Record<string, unknown> = { userId: req.params.user_id };
      UserService.deleteUser(args)
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
