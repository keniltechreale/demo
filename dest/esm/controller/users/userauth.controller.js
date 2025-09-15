import * as Utils from '../../lib/utils';
import UserService from '../../services/users/userAuth.service';
export default new (class AuthController {
    constructor() {
        this.userRegister = (req, res) => {
            try {
                const body = req.body;
                UserService.register(body, req.params.role)
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
        this.resendOtp = (req, res) => {
            try {
                const body = req.body;
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
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.login = (req, res) => {
            try {
                const body = req.body;
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
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.me = (req, res) => {
            const args = {
                userId: req.user.id,
            };
            UserService.me(args)
                .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                .catch((err) => res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))));
        };
        this.changePassword = (req, res) => {
            try {
                const body = req.body;
                const args = {
                    oldPassword: body.oldPassword,
                    newPassword: body.newPassword,
                };
                UserService.changePassword(args, req.user.id)
                    .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                    .catch((err) => res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))));
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.updateProfile = (req, res) => {
            const body = req.body;
            UserService.updateProfile(body, req.user.id)
                .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                .catch((err) => res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))));
        };
        this.ForgotPassword = (req, res) => {
            const body = req.body;
            const args = {
                email: body.email,
            };
            UserService.forgotPassword(args)
                .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                .catch((err) => res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))));
        };
        this.ResetPasswords = (req, res) => {
            const body = req.body;
            const args = {
                password: body.password,
            };
            UserService.ResetPassword(args, req.user.id)
                .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                .catch((err) => res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))));
        };
        this.deleteProfile = (req, res) => {
            UserService.deleteUser(req.user.id)
                .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                .catch((err) => res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))));
        };
        this.Logout = (req, res) => {
            UserService.Logout(req.user.id)
                .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                .catch((err) => res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))));
        };
    }
})();
//# sourceMappingURL=userauth.controller.js.map