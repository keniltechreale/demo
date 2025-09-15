import * as Utils from '../../lib/utils';
import PaymentService from '../../services/users/payment.service';
export default new (class PaymentController {
    constructor() {
        /**
         * Initialize ProxyPay payment for a ride
         */
        this.initializeProxyPayPayment = (req, res) => {
            try {
                const body = req.body;
                const rideId = req.params.ride_id;
                PaymentService.initializeProxyPayPayment(body, rideId)
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
        /**
         * Process ProxyPay webhook for ride payments
         */
        this.processProxyPayWebhook = (req, res) => {
            try {
                const body = req.body;
                const rideId = req.params.ride_id;
                PaymentService.processProxyPayWebhook(body, rideId)
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
        /**
         * Process ProxyPay webhook for wallet top-ups
         */
        this.processProxyPayWalletWebhook = (req, res) => {
            try {
                const body = req.body;
                PaymentService.processProxyPayWalletWebhook(body, req.user.id.toString())
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
        /**
         * Verify ProxyPay payment
         */
        this.verifyProxyPayPayment = (req, res) => {
            try {
                const reference = req.params.reference;
                PaymentService.verifyProxyPayPayment(reference)
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
        /**
         * Initialize wallet top-up payment
         */
        this.initializeWalletTopUp = (req, res) => {
            try {
                const { amount, currency } = req.body;
                const userId = req.user.id.toString();
                PaymentService.initializeWalletTopUp(amount, currency, userId)
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
        /**
         * Get payment gateway status
         */
        this.getPaymentGatewayStatus = (req, res) => {
            try {
                PaymentService.getPaymentGatewayStatus()
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
//# sourceMappingURL=payment.controller.js.map