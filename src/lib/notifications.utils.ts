import { customerApp, driverApp } from './fcm.utils';
import { messaging } from 'firebase-admin';
import logger from './logger';
import { IUser } from '../models/users.model';
import Notification from '../models/notifications.model';

export interface NotificationData {
  title: string;
  body: string;
  type?: string;
  data?: { [key: string]: any };
}
export const sendNotification = async (app: any, user: IUser, payload: NotificationData) => {
  const dataString = payload.data ? JSON.stringify(payload.data) : '{}';
  await Notification.create({
    user: user.id,
    title: payload.title,
    body: payload.body,
    type: payload.type,
  });
  const message: messaging.Message = {
    token: user.fcm_token,
    notification: {
      title: payload.title,
      body: payload.body,
    },
    android: {
      priority: 'high',
    },
    apns: {
      headers: {
        'apns-priority': '10',
      },
      payload: {
        aps: {
          alert: {
            title: payload.title,
            body: payload.body,
          },
          sound: 'default',
          contentAvailable: true,
        },
        data: dataString,
      },
    },
    data: { data: JSON.stringify(payload.data) },
  };

  try {
    const response = await app.messaging().send(message);
    logger.info('message : FCM Notification sent successfully', response);
  } catch (error) {
    logger.error('error : Error sending FCM Notifications', error);
  }
};

export const sendDriverNotification = async (user: IUser, payload: NotificationData) => {
  await sendNotification(driverApp, user, payload);
};

export const sendCustomerNotification = async (user: IUser, payload: NotificationData) => {
  await sendNotification(customerApp, user, payload);
};
