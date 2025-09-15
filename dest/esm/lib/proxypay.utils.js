var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import paymentConfig from '../config/payment.config';
import logger from './logger';
export class ProxyPayUtils {
    static getBaseUrl() {
        return paymentConfig.sandbox === 'true'
            ? paymentConfig.baseUrlSandbox
            : paymentConfig.baseUrlProduction;
    }
    static getHeaders() {
        return {
            Authorization: `Bearer ${paymentConfig.apiKey}`,
            'Content-Type': 'application/json',
        };
    }
    /**
     * Initialize a payment transaction
     */
    static initializePayment(paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const baseUrl = this.getBaseUrl();
                const url = `${baseUrl}/payments/initialize`;
                const payload = {
                    amount: paymentData.amount,
                    currency: paymentData.currency,
                    reference: paymentData.reference,
                    description: paymentData.description,
                    customer_email: paymentData.customer_email,
                    customer_name: paymentData.customer_name,
                    customer_phone: paymentData.customer_phone,
                    redirect_url: paymentData.redirect_url,
                    callback_url: paymentData.callback_url,
                };
                logger.info(`Initializing ProxyPay payment for reference: ${paymentData.reference}`);
                const response = yield axios.post(url, payload, {
                    headers: this.getHeaders(),
                    timeout: 30000, // 30 seconds timeout
                });
                logger.info(`ProxyPay payment initialized successfully for reference: ${paymentData.reference}`);
                return response.data;
            }
            catch (error) {
                logger.error(`Error initializing ProxyPay payment: ${error}`);
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        return {
                            success: false,
                            message: 'Payment initialization failed',
                            error: ((_a = error.response.data) === null || _a === void 0 ? void 0 : _a.message) || error.message,
                        };
                    }
                    else if (error.request) {
                        return {
                            success: false,
                            message: 'Network error occurred',
                            error: 'No response received from payment gateway',
                        };
                    }
                }
                return {
                    success: false,
                    message: 'Payment initialization failed',
                    error: error instanceof Error ? error.message : 'Unknown error occurred',
                };
            }
        });
    }
    /**
     * Verify a payment transaction
     */
    static verifyPayment(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const baseUrl = this.getBaseUrl();
                const url = `${baseUrl}/payments/verify/${reference}`;
                logger.info(`Verifying ProxyPay payment for reference: ${reference}`);
                const response = yield axios.get(url, {
                    headers: this.getHeaders(),
                    timeout: 30000, // 30 seconds timeout
                });
                logger.info(`ProxyPay payment verified successfully for reference: ${reference}`);
                return response.data;
            }
            catch (error) {
                logger.error(`Error verifying ProxyPay payment: ${error}`);
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        return {
                            success: false,
                            message: 'Payment verification failed',
                            error: ((_a = error.response.data) === null || _a === void 0 ? void 0 : _a.message) || error.message,
                        };
                    }
                    else if (error.request) {
                        return {
                            success: false,
                            message: 'Network error occurred',
                            error: 'No response received from payment gateway',
                        };
                    }
                }
                return {
                    success: false,
                    message: 'Payment verification failed',
                    error: error instanceof Error ? error.message : 'Unknown error occurred',
                };
            }
        });
    }
    /**
     * Generate a unique payment reference
     */
    static generatePaymentReference(prefix = 'PP') {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${prefix}${timestamp}${random}`;
    }
    /**
     * Validate webhook signature (if ProxyPay provides signature verification)
     */
    static validateWebhookSignature(payload, signature) {
        // This is a placeholder - implement actual signature validation based on ProxyPay's documentation
        // ProxyPay may provide a secret key or specific signature algorithm
        try {
            // For now, we'll return true - implement proper validation when you have the details
            logger.info('Webhook signature validation - implement based on ProxyPay documentation');
            return true;
        }
        catch (error) {
            logger.error(`Error validating webhook signature: ${error}`);
            return false;
        }
    }
    /**
     * Process webhook data
     */
    static processWebhookData(webhookData) {
        try {
            // Validate required fields
            if (!webhookData.reference ||
                !webhookData.status ||
                !webhookData.amount ||
                !webhookData.currency) {
                logger.error('Invalid webhook data: missing required fields');
                return {
                    isValid: false,
                    paymentStatus: 'invalid',
                    amount: 0,
                    currency: '',
                    reference: '',
                };
            }
            // Map ProxyPay status to your application status
            let paymentStatus = 'pending';
            switch (webhookData.status.toLowerCase()) {
                case 'successful':
                case 'completed':
                case 'paid':
                    paymentStatus = 'completed';
                    break;
                case 'failed':
                case 'declined':
                case 'rejected':
                    paymentStatus = 'failed';
                    break;
                case 'pending':
                case 'processing':
                    paymentStatus = 'pending';
                    break;
                case 'cancelled':
                case 'abandoned':
                    paymentStatus = 'cancelled';
                    break;
                default:
                    paymentStatus = 'unknown';
            }
            logger.info(`Webhook processed successfully for reference: ${webhookData.reference}, status: ${paymentStatus}`);
            return {
                isValid: true,
                paymentStatus,
                amount: webhookData.amount,
                currency: webhookData.currency,
                reference: webhookData.reference,
                customerEmail: webhookData.customer_email,
                customerName: webhookData.customer_name,
                customerPhone: webhookData.customer_phone,
            };
        }
        catch (error) {
            logger.error(`Error processing webhook data: ${error}`);
            return {
                isValid: false,
                paymentStatus: 'error',
                amount: 0,
                currency: '',
                reference: '',
            };
        }
    }
    /**
     * Check if payment is in sandbox mode
     */
    static isSandboxMode() {
        return paymentConfig.sandbox === 'true';
    }
    /**
     * Get payment gateway status
     */
    static getGatewayStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const baseUrl = this.getBaseUrl();
                const url = `${baseUrl}/health`; // Adjust endpoint based on ProxyPay's actual health check endpoint
                const response = yield axios.get(url, {
                    headers: this.getHeaders(),
                    timeout: 10000, // 10 seconds timeout for health check
                });
                return {
                    isOnline: response.status === 200,
                    message: 'Payment gateway is online',
                };
            }
            catch (error) {
                logger.error(`Payment gateway health check failed: ${error}`);
                return {
                    isOnline: false,
                    message: 'Payment gateway is offline or unreachable',
                };
            }
        });
    }
}
//# sourceMappingURL=proxypay.utils.js.map