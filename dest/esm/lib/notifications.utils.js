var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { customerApp, driverApp } from './fcm.utils';
import logger from './logger';
import Notification from '../models/notifications.model';
export const sendNotification = (app, user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const dataString = payload.data ? JSON.stringify(payload.data) : '{}';
    yield Notification.create({
        user: user.id,
        title: payload.title,
        body: payload.body,
        type: payload.type,
    });
    const message = {
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
        const response = yield app.messaging().send(message);
        logger.info('message : FCM Notification sent successfully', response);
    }
    catch (error) {
        logger.error('error : Error sending FCM Notifications', error);
    }
});
export const sendDriverNotification = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield sendNotification(driverApp, user, payload);
});
export const sendCustomerNotification = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield sendNotification(customerApp, user, payload);
});
//# sourceMappingURL=notifications.utils.js.map