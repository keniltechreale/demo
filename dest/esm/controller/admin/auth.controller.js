import * as Utils from '../../lib/utils';
import AdminUserService from '../../services/admin/adminuser.service';
export default new (class AuthController {
    constructor() {
        this.login = (req, res) => {
            try {
                const body = req.body;
                const args = {
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
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.me = (req, res) => {
            const args = {
                userId: req.admin.id,
            };
            AdminUserService.me(args)
                .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                .catch((err) => res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))));
        };
        this.forgotPassword = (req, res) => {
            try {
                const body = req.body;
                const args = {
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
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.verifyOtp = (req, res) => {
            try {
                const body = req.body;
                const args = {
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
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.resetPassword = (req, res) => {
            try {
                const body = req.body;
                const args = {
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
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
    }
})();
//# sourceMappingURL=auth.controller.js.map