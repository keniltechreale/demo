export interface IProxyPayPaymentRequest {
    amount: number;
    currency: string;
    reference: string;
    description: string;
    customer_email?: string;
    customer_name?: string;
    customer_phone?: string;
    redirect_url?: string;
    callback_url?: string;
}
export interface IProxyPayPaymentResponse {
    success: boolean;
    message: string;
    data?: {
        reference: string;
        payment_url: string;
        status: string;
        amount: number;
        currency: string;
    };
    error?: string;
}
export interface IProxyPayVerificationResponse {
    success: boolean;
    message: string;
    data?: {
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
    error?: string;
}
export interface IProxyPayWebhookData {
    reference: string;
    status: string;
    amount: number;
    currency: string;
    customer_email?: string;
    customer_name?: string;
    customer_phone?: string;
    created_at: string;
    updated_at: string;
    transaction_id?: string;
}
export declare class ProxyPayUtils {
    private static getBaseUrl;
    private static getHeaders;
    /**
     * Initialize a payment transaction
     */
    static initializePayment(paymentData: IProxyPayPaymentRequest): Promise<IProxyPayPaymentResponse>;
    /**
     * Verify a payment transaction
     */
    static verifyPayment(reference: string): Promise<IProxyPayVerificationResponse>;
    /**
     * Generate a unique payment reference
     */
    static generatePaymentReference(prefix?: string): string;
    /**
     * Validate webhook signature (if ProxyPay provides signature verification)
     */
    static validateWebhookSignature(payload: any, signature: string): boolean;
    /**
     * Process webhook data
     */
    static processWebhookData(webhookData: IProxyPayWebhookData): {
        isValid: boolean;
        paymentStatus: string;
        amount: number;
        currency: string;
        reference: string;
        customerEmail?: string;
        customerName?: string;
        customerPhone?: string;
    };
    /**
     * Check if payment is in sandbox mode
     */
    static isSandboxMode(): boolean;
    /**
     * Get payment gateway status
     */
    static getGatewayStatus(): Promise<{
        isOnline: boolean;
        message: string;
    }>;
}
