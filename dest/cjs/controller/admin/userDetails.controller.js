"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils = __importStar(require("../../lib/utils"));
const userdetails_service_1 = __importDefault(require("../../services/admin/userdetails.service"));
// import { IVehicleData } from '../../middleware/validation.middleware';
const pagination_config_1 = __importDefault(require("../../config/pagination.config"));
exports.default = new (class UserDetailsController {
    constructor() {
        this.addDriverUser = (req, res) => {
            try {
                const body = req.body;
                const args = {
                    name: body.name,
                    email: body.email,
                    country_code: body.country_code,
                    phone_number: body.phone_number,
                    referral_code: body.referral_code,
                    registeredBy: 'admin',
                    role: 'driver',
                };
                userdetails_service_1.default.addDriver(args)
                    .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                    .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
            }
            catch (err) {
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
        this.userCount = (req, res) => {
            try {
                userdetails_service_1.default.userCount()
                    .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                    .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.usersList = (req, res) => {
            try {
                const args = {
                    page: Number(req.query.page) || 1,
                    limit: Number(req.query.limit) || pagination_config_1.default.PER_PAGE,
                    search: req.query.search || '',
                    status: req.query.status,
                };
                userdetails_service_1.default.userList(args, req.params.role)
                    .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                    .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.userDetails = (req, res) => {
            try {
                const args = {
                    userId: req.params.user_id,
                };
                userdetails_service_1.default.userDetails(args)
                    .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                    .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.updateVehicle = (req, res) => {
            try {
                const body = req.body;
                userdetails_service_1.default.updateVehicle(body, req.params.vehicle_id)
                    .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                    .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.updateUser = (req, res) => {
            try {
                const body = req.body;
                const args = {
                    status: body.status,
                };
                userdetails_service_1.default.updateUser(args, req.params.user_id)
                    .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                    .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.viewVehicles = (req, res) => {
            try {
                userdetails_service_1.default.viewVehicle(req.params.user_id)
                    .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                    .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.paymentHistory = (req, res) => {
            try {
                const args = {
                    startDate: req.query.startDate,
                    endDate: req.query.endDate,
                };
                userdetails_service_1.default.getPaymentHistory(args, req.params.user_id)
                    .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                    .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.deleteUser = (req, res) => {
            try {
                const args = { userId: req.params.user_id };
                userdetails_service_1.default.deleteUser(args)
                    .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                    .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
    }
})();
//# sourceMappingURL=userDetails.controller.js.map