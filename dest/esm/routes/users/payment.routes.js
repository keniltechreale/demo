import express from 'express';
import PaymentController from '../../controller/users/payment.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();
// ProxyPay payment routes
router.post('/proxypay/initialize/:ride_id', AuthGuard.verifyUserAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.Payment), PaymentController.initializeProxyPayPayment);
router.post('/proxypay/webhook/ride/:ride_id', PaymentController.processProxyPayWebhook);
router.post('/proxypay/webhook/wallet', PaymentController.processProxyPayWalletWebhook);
router.get('/proxypay/verify/:reference', AuthGuard.verifyUserAccessToken, PaymentController.verifyProxyPayPayment);
router.post('/proxypay/wallet-topup', AuthGuard.verifyUserAccessToken, PaymentController.initializeWalletTopUp);
router.get('/proxypay/status', PaymentController.getPaymentGatewayStatus);
export default router;
//# sourceMappingURL=payment.routes.js.map