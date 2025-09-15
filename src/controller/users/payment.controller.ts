import { Response } from 'express';
import * as Utils from '../../lib/utils';
import PaymentService from '../../services/users/payment.service';
import { IRequest } from '../../lib/common.interface';
import { IPaymentData } from '../../middleware/validation.middleware';
import { IProxyPayWebhookData } from '../../lib/proxypay.utils';

export default new (class PaymentController {
  /**
   * Initialize ProxyPay payment for a ride
   */
  initializeProxyPayPayment = (req: IRequest, res: Response): void => {
    try {
      const body: IPaymentData = req.body as IPaymentData;
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
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  /**
   * Process ProxyPay webhook for ride payments
   */
  processProxyPayWebhook = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as unknown as IProxyPayWebhookData;
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
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  /**
   * Process ProxyPay webhook for wallet top-ups
   */
  processProxyPayWalletWebhook = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as unknown as IProxyPayWebhookData;

      PaymentService.processProxyPayWalletWebhook(body, req.user.id.toString())
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  /**
   * Verify ProxyPay payment
   */
  verifyProxyPayPayment = (req: IRequest, res: Response): void => {
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
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  /**
   * Initialize wallet top-up payment
   */
  initializeWalletTopUp = (req: IRequest, res: Response): void => {
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
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  /**
   * Get payment gateway status
   */
  getPaymentGatewayStatus = (req: IRequest, res: Response): void => {
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
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };
})();
