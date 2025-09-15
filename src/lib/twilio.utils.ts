import twilioConfig from '../config/twilio.config';
import { Twilio } from 'twilio';
import logger from './logger';

const client: Twilio = new Twilio(twilioConfig.accountSid, twilioConfig.authToken);

interface TwilioError extends Error {
  code?: number;
}

export const sendRegisterOTP = async (to: string, otp: string): Promise<void> => {
  try {
    const message = await client.messages.create({
      body: `Your OTP to register PiuPiu is: ${otp}. This OTP is for registration verification and is valid for 15 minutes. Please do not share it with anyone.`,
      from: twilioConfig.phoneNumber,
      to: to,
      forceDelivery: true,
    });
    logger.info('TWILIO OTP sent successfully:', message.sid);
  } catch (error) {
    const twilioError = error as TwilioError;
    logger.error('Error sending OTP:', error);
    if (twilioError.code === 21211) {
      throw new Error(
        'The phone number provided is incorrect. Please enter a valid mobile number.',
      );
    }
    throw new Error('Failed to send OTP. Please try again later.');
  }
};

export const sendLoginOTP = async (to: string, otp: string): Promise<void> => {
  try {
    const message = await client.messages.create({
      body: `Your OTP for logging into PiuPiu is: ${otp}. This OTP is for verification purposes and is valid for 15 minutes. Please do not share it with anyone.`,
      from: twilioConfig.phoneNumber,
      to: to,
      forceDelivery: true,
    });
    logger.info('TWILIO OTP sent successfully', message.sid);
  } catch (error) {
    const twilioError = error as TwilioError;
    logger.error('Error sending OTP:', error);
    if (twilioError.code === 21211) {
      throw new Error(
        'The phone number provided is incorrect. Please enter a valid mobile number.',
      );
    }
    throw new Error('Failed to send OTP. Please try again later.');
  }
};


export const sendEmergencyContactOTP = async (to: string, otp: string): Promise<void> => {
  try {
    const message = await client.messages.create({
      body: `Your OTP to add or verify an emergency contact for PiuPiu is: ${otp}. This OTP is valid for 15 minutes and should remain private.`,
      from: twilioConfig.phoneNumber,
      to: to,
      forceDelivery: true,
    });
    logger.info('TWILIO OTP sent successfully:', message.sid);
  } catch (error) {
    const twilioError = error as TwilioError;
    logger.error('Error sending OTP:', error);
    if (twilioError.code === 21211) {
      throw new Error(
        'The phone number provided is incorrect. Please enter a valid mobile number.',
      );
    }
    throw new Error('Failed to send OTP. Please try again later.');
  }
};
