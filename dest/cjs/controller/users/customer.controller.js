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
const customer_service_1 = __importDefault(require("../../services/users/customer.service"));
exports.default = new (class DriverController {
    constructor() {
        this.ViewDashboard = (req, res) => {
            try {
                const body = req.body;
                customer_service_1.default.ViewDashboard(body)
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
        this.AvailableVehicleCategories = (req, res) => {
            try {
                customer_service_1.default.AvailableVehicleCategories(req.params.ride_id)
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
        this.selectDrivers = (req, res) => {
            try {
                const body = req.body; // Specify the expected structure
                if (!Array.isArray(body.driverIds) || !body.driverIds.every((id) => typeof id === 'number')) {
                    Utils.throwError('Invalid driverIds');
                }
                const args = {
                    driverIds: body.driverIds,
                };
                customer_service_1.default.selectDrivers(req.params.ride_id, args)
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
        this.addInstructions = (req, res) => {
            try {
                const body = req.body;
                customer_service_1.default.addInstructions(body, req.params.ride_id)
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
        this.VerifyCoupon = (req, res) => {
            try {
                const body = req.body;
                customer_service_1.default.verifyCoupon(body, req.params.ride_id, req.params.type)
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
        this.redeemCoupon = (req, res) => {
            try {
                const body = req.body;
                customer_service_1.default.redeemCoupons(body, req.params.ride_id)
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
//# sourceMappingURL=customer.controller.js.map