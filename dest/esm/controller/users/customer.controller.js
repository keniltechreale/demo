import * as Utils from '../../lib/utils';
import CustomerServices from '../../services/users/customer.service';
export default new (class DriverController {
    constructor() {
        this.ViewDashboard = (req, res) => {
            try {
                const body = req.body;
                CustomerServices.ViewDashboard(body)
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
                CustomerServices.AvailableVehicleCategories(req.params.ride_id)
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
                CustomerServices.selectDrivers(req.params.ride_id, args)
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
                CustomerServices.addInstructions(body, req.params.ride_id)
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
                CustomerServices.verifyCoupon(body, req.params.ride_id, req.params.type)
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
                CustomerServices.redeemCoupons(body, req.params.ride_id)
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