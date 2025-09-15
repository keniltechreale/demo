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
exports.sendEmergencyContactOTP = exports.sendLoginOTP = exports.sendRegisterOTP = void 0;
const twilio_config_1 = __importDefault(require("../config/twilio.config"));
const twilio_1 = require("twilio");
const logger_1 = __importDefault(require("./logger"));
const client = new twilio_1.Twilio(twilio_config_1.default.accountSid, twilio_config_1.default.authToken);
const sendRegisterOTP = (to, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield client.messages.create({
            body: `Your OTP to register PiuPiu is: ${otp}. This OTP is for registration verification and is valid for 15 minutes. Please do not share it with anyone.`,
            from: twilio_config_1.default.phoneNumber,
            to: to,
            forceDelivery: true,
        });
        logger_1.default.info('TWILIO OTP sent successfully:', message.sid);
    }
    catch (error) {
        const twilioError = error;
        logger_1.default.error('Error sending OTP:', error);
        if (twilioError.code === 21211) {
            throw new Error('The phone number provided is incorrect. Please enter a valid mobile number.');
        }
        throw new Error('Failed to send OTP. Please try again later.');
    }
});
exports.sendRegisterOTP = sendRegisterOTP;
const sendLoginOTP = (to, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield client.messages.create({
            body: `Your OTP for logging into PiuPiu is: ${otp}. This OTP is for verification purposes and is valid for 15 minutes. Please do not share it with anyone.`,
            from: twilio_config_1.default.phoneNumber,
            to: to,
            forceDelivery: true,
        });
        logger_1.default.info('TWILIO OTP sent successfully', message.sid);
    }
    catch (error) {
        const twilioError = error;
        logger_1.default.error('Error sending OTP:', error);
        if (twilioError.code === 21211) {
            throw new Error('The phone number provided is incorrect. Please enter a valid mobile number.');
        }
        throw new Error('Failed to send OTP. Please try again later.');
    }
});
exports.sendLoginOTP = sendLoginOTP;
const sendEmergencyContactOTP = (to, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield client.messages.create({
            body: `Your OTP to add or verify an emergency contact for PiuPiu is: ${otp}. This OTP is valid for 15 minutes and should remain private.`,
            from: twilio_config_1.default.phoneNumber,
            to: to,
            forceDelivery: true,
        });
        logger_1.default.info('TWILIO OTP sent successfully:', message.sid);
    }
    catch (error) {
        const twilioError = error;
        logger_1.default.error('Error sending OTP:', error);
        if (twilioError.code === 21211) {
            throw new Error('The phone number provided is incorrect. Please enter a valid mobile number.');
        }
        throw new Error('Failed to send OTP. Please try again later.');
    }
});
exports.sendEmergencyContactOTP = sendEmergencyContactOTP;
//# sourceMappingURL=twilio.utils.js.map