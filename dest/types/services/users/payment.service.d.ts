import { IPaymentData } from '../../middleware/validation.middleware';
import { IProxyPayWebhookData } from '../../lib/proxypay.utils';
declare const _default: {
    /**
     * Initialize ProxyPay payment for a ride
     */
    initializeProxyPayPayment(paymentDetails: IPaymentData, rideId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            transaction_id: number;
            reference: string;
            payment_url: string;
            amount: number;
            currency: string;
        };
    }>;
    /**
     * Process ProxyPay webhook for ride payments
     */
    processProxyPayWebhook(webhookData: IProxyPayWebhookData, rideId: string): Promise<{
        success: boolean;
        message: string;
        transaction_status: string;
    }>;
    /**
     * Process ProxyPay webhook for wallet top-ups
     */
    processProxyPayWalletWebhook(webhookData: IProxyPayWebhookData, userId: string): Promise<{
        success: boolean;
        message: string;
        transaction_status: string;
    }>;
    /**
     * Verify ProxyPay payment
     */
    verifyProxyPayPayment(reference: string): Promise<{
        success: boolean;
        message: string;
        data: {
            reference: string;
            status: string;
            amount: number;
            currency: string;
            customer_email?: string;
            customer_name?: string;
            customer_phone?: string;
            created_at: string;
            updated_at: string;
        };
    }>;
    /**
     * Initialize wallet top-up payment
     */
    initializeWalletTopUp(amount: number, currency: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            transaction_id: number;
            reference: string;
            payment_url: string;
            amount: number;
            currency: string;
        };
    }>;
    /**
     * Complete ride after successful payment
     */
    completeRideAfterPayment(rideId: string, transactionId: number): Promise<void>;
    /**
     * Credit wallet after successful payment
     */
    creditWalletAfterPayment(userId: string, amount: number, transactionId: number): Promise<void>;
    /**
     * Get payment gateway status
     */
    getPaymentGatewayStatus(): Promise<{
        isOnline: boolean;
        message: string;
    }>;
};
export default _default;
