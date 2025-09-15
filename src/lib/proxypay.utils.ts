import axios, { AxiosResponse } from 'axios';
import paymentConfig from '../config/payment.config';
import logger from './logger';

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

export class ProxyPayUtils {
  private static getBaseUrl(): string {
    return paymentConfig.sandbox === 'true'
      ? paymentConfig.baseUrlSandbox
      : paymentConfig.baseUrlProduction;
  }

  private static getHeaders() {
    return {
      Authorization: `Bearer ${paymentConfig.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Initialize a payment transaction
   */
  static async initializePayment(
    paymentData: IProxyPayPaymentRequest,
  ): Promise<IProxyPayPaymentResponse> {
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

      const response: AxiosResponse<IProxyPayPaymentResponse> = await axios.post(url, payload, {
        headers: this.getHeaders(),
        timeout: 30000, // 30 seconds timeout
      });

      logger.info(
        `ProxyPay payment initialized successfully for reference: ${paymentData.reference}`,
      );
      return response.data;
    } catch (error) {
      logger.error(`Error initializing ProxyPay payment: ${error}`);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          return {
            success: false,
            message: 'Payment initialization failed',
            error: error.response.data?.message || error.message,
          };
        } else if (error.request) {
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
  }

  /**
   * Verify a payment transaction
   */
  static async verifyPayment(reference: string): Promise<IProxyPayVerificationResponse> {
    try {
      const baseUrl = this.getBaseUrl();
      const url = `${baseUrl}/payments/verify/${reference}`;

      logger.info(`Verifying ProxyPay payment for reference: ${reference}`);

      const response: AxiosResponse<IProxyPayVerificationResponse> = await axios.get(url, {
        headers: this.getHeaders(),
        timeout: 30000, // 30 seconds timeout
      });

      logger.info(`ProxyPay payment verified successfully for reference: ${reference}`);
      return response.data;
    } catch (error) {
      logger.error(`Error verifying ProxyPay payment: ${error}`);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          return {
            success: false,
            message: 'Payment verification failed',
            error: error.response.data?.message || error.message,
          };
        } else if (error.request) {
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
  }

  /**
   * Generate a unique payment reference
   */
  static generatePaymentReference(prefix: string = 'PP'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Validate webhook signature (if ProxyPay provides signature verification)
   */
  static validateWebhookSignature(payload: any, signature: string): boolean {
    // This is a placeholder - implement actual signature validation based on ProxyPay's documentation
    // ProxyPay may provide a secret key or specific signature algorithm
    try {
      // For now, we'll return true - implement proper validation when you have the details
      logger.info('Webhook signature validation - implement based on ProxyPay documentation');
      return true;
    } catch (error) {
      logger.error(`Error validating webhook signature: ${error}`);
      return false;
    }
  }

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
  } {
    try {
      // Validate required fields
      if (
        !webhookData.reference ||
        !webhookData.status ||
        !webhookData.amount ||
        !webhookData.currency
      ) {
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

      logger.info(
        `Webhook processed successfully for reference: ${webhookData.reference}, status: ${paymentStatus}`,
      );

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
    } catch (error) {
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
  static isSandboxMode(): boolean {
    return paymentConfig.sandbox === 'true';
  }

  /**
   * Get payment gateway status
   */
  static async getGatewayStatus(): Promise<{ isOnline: boolean; message: string }> {
    try {
      const baseUrl = this.getBaseUrl();
      const url = `${baseUrl}/health`; // Adjust endpoint based on ProxyPay's actual health check endpoint

      const response = await axios.get(url, {
        headers: this.getHeaders(),
        timeout: 10000, // 10 seconds timeout for health check
      });

      return {
        isOnline: response.status === 200,
        message: 'Payment gateway is online',
      };
    } catch (error) {
      logger.error(`Payment gateway health check failed: ${error}`);
      return {
        isOnline: false,
        message: 'Payment gateway is offline or unreachable',
      };
    }
  }
}
