// import axios from 'axios';
// import FlutterwaveConfig from '../config/flutterwave.config';

// interface IFlutterwaveResponse {
//   data: {
//     transactionId: string;
//     status: string;
//   };
// }

// interface IPaymentResult {
//   transactionId: string;
//   status: string;
// }

// export class PaymentProvider {
//   static async makePayment(
//     amount: number,
//     currency: string,
//     paymentMethod: string,
//   ): Promise<IPaymentResult> {
//     const response = await axios.post<IFlutterwaveResponse>(
//       'https://api.flutterwave.com/v3/payments',
//       {
//         tx_ref: 'your-unique-tx-ref',
//         amount,
//         currency,
//         payment_method: paymentMethod,
//         redirect_url: 'https://your-redirect-url.com',
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${FlutterwaveConfig.Test_SecretKey}`,
//         },
//       },
//     );

//     const { transactionId, status } = response.data.data;
//     return { transactionId, status };
//   }
// }
