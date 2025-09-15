import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    /**
     * Initialize ProxyPay payment for a ride
     */
    initializeProxyPayPayment: (req: IRequest, res: Response) => void;
    /**
     * Process ProxyPay webhook for ride payments
     */
    processProxyPayWebhook: (req: IRequest, res: Response) => void;
    /**
     * Process ProxyPay webhook for wallet top-ups
     */
    processProxyPayWalletWebhook: (req: IRequest, res: Response) => void;
    /**
     * Verify ProxyPay payment
     */
    verifyProxyPayPayment: (req: IRequest, res: Response) => void;
    /**
     * Initialize wallet top-up payment
     */
    initializeWalletTopUp: (req: IRequest, res: Response) => void;
    /**
     * Get payment gateway status
     */
    getPaymentGatewayStatus: (req: IRequest, res: Response) => void;
};
export default _default;
