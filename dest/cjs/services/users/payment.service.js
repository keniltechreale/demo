"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_model_1 = __importDefault(require("../../models/transaction.model"));
const rides_model_1 = __importDefault(require("../../models/rides.model"));
const users_model_1 = __importDefault(require("../../models/users.model"));
const notifications_utils_1 = require("../../lib/notifications.utils");
const logger_1 = __importDefault(require("../../lib/logger"));
const wallet_model_1 = __importDefault(require("../../models/wallet.model"));
const proxypay_utils_1 = require("../../lib/proxypay.utils");
exports.default = new (class PaymentService {
    /**
     * Initialize ProxyPay payment for a ride
     */
    initializeProxyPayPayment(paymentDetails, rideId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const ride = yield rides_model_1.default.findOne({
                    where: { id: rideId },
                    include: [
                        {
                            model: users_model_1.default,
                            as: 'passenger',
                            attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                if (!ride) {
                    throw new Error('Ride not found');
                }
                const txRefId = proxypay_utils_1.ProxyPayUtils.generatePaymentReference('RIDE');
                const paymentRequest = {
                    amount: paymentDetails.amount,
                    currency: paymentDetails.currency || 'NGN',
                    reference: txRefId,
                    description: `Payment for ride ${rideId}`,
                    customer_email: ride.passenger.email,
                    customer_name: ride.passenger.name,
                    customer_phone: ride.passenger.phone_number,
                    redirect_url: 'https://customer.PiuPiu.com/home',
                    callback_url: `${process.env.BASE_URL}/api/users/payment/proxypay/webhook/ride/${rideId}`,
                };
                // Initialize payment with ProxyPay
                const paymentResponse = yield proxypay_utils_1.ProxyPayUtils.initializePayment(paymentRequest);
                if (!paymentResponse.success) {
                    throw new Error(paymentResponse.error || 'Payment initialization failed');
                }
                // Create transaction record
                const transaction = yield transaction_model_1.default.create({
                    tx_ref: txRefId,
                    rideId: parseInt(rideId),
                    user: ride.passenger.id,
                    amount: paymentDetails.amount,
                    currency: paymentDetails.currency || 'NGN',
                    payment_type: 'proxypay',
                    status: 'pending',
                    method: 'proxypay',
                    transactionType: 'debit',
                    type: 'ride',
                    purpose: `Payment for ride ${rideId}`,
                    transactionId: txRefId,
                });
                logger_1.default.info(`ProxyPay payment initialized for ride ${rideId}, transaction: ${txRefId}`);
                return {
                    success: true,
                    message: 'Payment initialized successfully',
                    data: {
                        transaction_id: transaction.id,
                        reference: txRefId,
                        payment_url: (_a = paymentResponse.data) === null || _a === void 0 ? void 0 : _a.payment_url,
                        amount: paymentDetails.amount,
                        currency: paymentDetails.currency || 'NGN',
                    },
                };
            }
            catch (error) {
                logger_1.default.error(`Error initializing ProxyPay payment: ${error}`);
                throw error;
            }
        });
    }
    /**
     * Process ProxyPay webhook for ride payments
     */
    processProxyPayWebhook(webhookData, rideId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`Processing ProxyPay webhook for ride ${rideId}, reference: ${webhookData.reference}`);
                // Process webhook data
                const processedData = proxypay_utils_1.ProxyPayUtils.processWebhookData(webhookData);
                if (!processedData.isValid) {
                    throw new Error('Invalid webhook data');
                }
                // Find the transaction
                const transaction = yield transaction_model_1.default.findOne({
                    where: {
                        tx_ref: webhookData.reference,
                        rideId: parseInt(rideId),
                    },
                });
                if (!transaction) {
                    throw new Error('Transaction not found');
                }
                // Update transaction status
                yield transaction.update({
                    status: processedData.paymentStatus,
                    transactionId: webhookData.reference,
                });
                // If payment is successful, complete the ride
                if (processedData.paymentStatus === 'completed') {
                    yield this.completeRideAfterPayment(rideId, transaction.id);
                }
                logger_1.default.info(`ProxyPay webhook processed successfully for ride ${rideId}`);
                return {
                    success: true,
                    message: 'Webhook processed successfully',
                    transaction_status: processedData.paymentStatus,
                };
            }
            catch (error) {
                logger_1.default.error(`Error processing ProxyPay webhook: ${error}`);
                throw error;
            }
        });
    }
    /**
     * Process ProxyPay webhook for wallet top-ups
     */
    processProxyPayWalletWebhook(webhookData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`Processing ProxyPay wallet webhook for user ${userId}, reference: ${webhookData.reference}`);
                const processedData = proxypay_utils_1.ProxyPayUtils.processWebhookData(webhookData);
                if (!processedData.isValid) {
                    throw new Error('Invalid webhook data');
                }
                // Find the transaction
                const transaction = yield transaction_model_1.default.findOne({
                    where: {
                        tx_ref: webhookData.reference,
                        user: parseInt(userId),
                        type: 'wallet_topup',
                    },
                });
                if (!transaction) {
                    throw new Error('Transaction not found');
                }
                // Update transaction status
                yield transaction.update({
                    status: processedData.paymentStatus,
                    transactionId: webhookData.reference,
                });
                // If payment is successful, credit the wallet
                if (processedData.paymentStatus === 'completed') {
                    yield this.creditWalletAfterPayment(userId, processedData.amount, transaction.id);
                }
                logger_1.default.info(`ProxyPay wallet webhook processed successfully for user ${userId}`);
                return {
                    success: true,
                    message: 'Wallet webhook processed successfully',
                    transaction_status: processedData.paymentStatus,
                };
            }
            catch (error) {
                logger_1.default.error(`Error processing ProxyPay wallet webhook: ${error}`);
                throw error;
            }
        });
    }
    /**
     * Verify ProxyPay payment
     */
    verifyProxyPayPayment(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                logger_1.default.info(`Verifying ProxyPay payment for reference: ${reference}`);
                const verificationResponse = yield proxypay_utils_1.ProxyPayUtils.verifyPayment(reference);
                if (!verificationResponse.success) {
                    throw new Error(verificationResponse.error || 'Payment verification failed');
                }
                // Find and update transaction
                const transaction = yield transaction_model_1.default.findOne({
                    where: { tx_ref: reference },
                });
                if (transaction) {
                    yield transaction.update({
                        status: ((_a = verificationResponse.data) === null || _a === void 0 ? void 0 : _a.status) || 'verified',
                    });
                }
                return {
                    success: true,
                    message: 'Payment verified successfully',
                    data: verificationResponse.data,
                };
            }
            catch (error) {
                logger_1.default.error(`Error verifying ProxyPay payment: ${error}`);
                throw error;
            }
        });
    }
    /**
     * Initialize wallet top-up payment
     */
    initializeWalletTopUp(amount, currency, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield users_model_1.default.findByPk(userId);
                if (!user) {
                    throw new Error('User not found');
                }
                const txRefId = proxypay_utils_1.ProxyPayUtils.generatePaymentReference('WLT');
                const paymentRequest = {
                    amount,
                    currency: currency || 'NGN',
                    reference: txRefId,
                    description: `Wallet top-up of ${currency} ${amount}`,
                    customer_email: user.email,
                    customer_name: user.name,
                    customer_phone: user.phone_number,
                    redirect_url: 'https://customer.PiuPiu.com/wallet',
                    callback_url: `${process.env.BASE_URL}/api/users/payment/proxypay/webhook/wallet`,
                };
                // Initialize payment with ProxyPay
                const paymentResponse = yield proxypay_utils_1.ProxyPayUtils.initializePayment(paymentRequest);
                if (!paymentResponse.success) {
                    throw new Error(paymentResponse.error || 'Payment initialization failed');
                }
                // Create transaction record
                const transaction = yield transaction_model_1.default.create({
                    tx_ref: txRefId,
                    user: parseInt(userId),
                    amount,
                    currency: currency || 'NGN',
                    payment_type: 'proxypay',
                    status: 'pending',
                    method: 'proxypay',
                    transactionType: 'credit',
                    type: 'wallet_topup',
                    purpose: `Wallet top-up of ${currency} ${amount}`,
                    transactionId: txRefId,
                });
                logger_1.default.info(`ProxyPay wallet top-up initialized for user ${userId}, transaction: ${txRefId}`);
                return {
                    success: true,
                    message: 'Wallet top-up payment initialized successfully',
                    data: {
                        transaction_id: transaction.id,
                        reference: txRefId,
                        payment_url: (_a = paymentResponse.data) === null || _a === void 0 ? void 0 : _a.payment_url,
                        amount,
                        currency: currency || 'NGN',
                    },
                };
            }
            catch (error) {
                logger_1.default.error(`Error initializing wallet top-up payment: ${error}`);
                throw error;
            }
        });
    }
    /**
     * Complete ride after successful payment
     */
    completeRideAfterPayment(rideId, transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ride = yield rides_model_1.default.findByPk(rideId);
                if (ride) {
                    yield ride.update({
                        status: 'completed',
                        payment_status: 'paid',
                    });
                    // Update transaction with ride completion
                    yield transaction_model_1.default.update({ status: 'completed' }, { where: { id: transactionId } });
                    // Send notifications
                    const passenger = yield users_model_1.default.findByPk(ride.passengerId);
                    if (passenger) {
                        yield (0, notifications_utils_1.sendCustomerNotification)(passenger, {
                            title: 'Payment successful',
                            body: 'Your ride payment has been processed successfully.',
                            type: 'payment_successful',
                        });
                    }
                    if (ride.driverId) {
                        const driver = yield users_model_1.default.findByPk(ride.driverId);
                        if (driver) {
                            yield (0, notifications_utils_1.sendDriverNotification)(driver, {
                                title: 'Payment received',
                                body: 'Payment for the ride has been received.',
                                type: 'payment_received',
                            });
                        }
                    }
                    logger_1.default.info(`Ride ${rideId} completed after successful payment`);
                }
            }
            catch (error) {
                logger_1.default.error(`Error completing ride after payment: ${error}`);
            }
        });
    }
    /**
     * Credit wallet after successful payment
     */
    creditWalletAfterPayment(userId, amount, transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let wallet = yield wallet_model_1.default.findOne({ where: { user: parseInt(userId) } });
                if (!wallet) {
                    wallet = yield wallet_model_1.default.create({
                        user: parseInt(userId),
                        amount: amount,
                        currency: 'NGN',
                    });
                }
                else {
                    yield wallet.update({
                        amount: wallet.amount + amount,
                    });
                }
                // Update transaction
                yield transaction_model_1.default.update({ status: 'completed' }, { where: { id: transactionId } });
                logger_1.default.info(`Wallet credited for user ${userId} with amount ${amount}`);
            }
            catch (error) {
                logger_1.default.error(`Error crediting wallet after payment: ${error}`);
            }
        });
    }
    /**
     * Get payment gateway status
     */
    getPaymentGatewayStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield proxypay_utils_1.ProxyPayUtils.getGatewayStatus();
            }
            catch (error) {
                logger_1.default.error(`Error getting payment gateway status: ${error}`);
                return {
                    isOnline: false,
                    message: 'Unable to check gateway status',
                };
            }
        });
    }
})();
//# sourceMappingURL=payment.service.js.map