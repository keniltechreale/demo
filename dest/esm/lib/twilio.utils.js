var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import twilioConfig from '../config/twilio.config';
import { Twilio } from 'twilio';
import logger from './logger';
const client = new Twilio(twilioConfig.accountSid, twilioConfig.authToken);
export const sendRegisterOTP = (to, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield client.messages.create({
            body: `Your OTP to register PiuPiu is: ${otp}. This OTP is for registration verification and is valid for 15 minutes. Please do not share it with anyone.`,
            from: twilioConfig.phoneNumber,
            to: to,
            forceDelivery: true,
        });
        logger.info('TWILIO OTP sent successfully:', message.sid);
    }
    catch (error) {
        const twilioError = error;
        logger.error('Error sending OTP:', error);
        if (twilioError.code === 21211) {
            throw new Error('The phone number provided is incorrect. Please enter a valid mobile number.');
        }
        throw new Error('Failed to send OTP. Please try again later.');
    }
});
export const sendLoginOTP = (to, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield client.messages.create({
            body: `Your OTP for logging into PiuPiu is: ${otp}. This OTP is for verification purposes and is valid for 15 minutes. Please do not share it with anyone.`,
            from: twilioConfig.phoneNumber,
            to: to,
            forceDelivery: true,
        });
        logger.info('TWILIO OTP sent successfully', message.sid);
    }
    catch (error) {
        const twilioError = error;
        logger.error('Error sending OTP:', error);
        if (twilioError.code === 21211) {
            throw new Error('The phone number provided is incorrect. Please enter a valid mobile number.');
        }
        throw new Error('Failed to send OTP. Please try again later.');
    }
});
export const sendEmergencyContactOTP = (to, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield client.messages.create({
            body: `Your OTP to add or verify an emergency contact for PiuPiu is: ${otp}. This OTP is valid for 15 minutes and should remain private.`,
            from: twilioConfig.phoneNumber,
            to: to,
            forceDelivery: true,
        });
        logger.info('TWILIO OTP sent successfully:', message.sid);
    }
    catch (error) {
        const twilioError = error;
        logger.error('Error sending OTP:', error);
        if (twilioError.code === 21211) {
            throw new Error('The phone number provided is incorrect. Please enter a valid mobile number.');
        }
        throw new Error('Failed to send OTP. Please try again later.');
    }
});
//# sourceMappingURL=twilio.utils.js.map