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
exports.sendCustomerNotification = exports.sendDriverNotification = exports.sendNotification = void 0;
const fcm_utils_1 = require("./fcm.utils");
const logger_1 = __importDefault(require("./logger"));
const notifications_model_1 = __importDefault(require("../models/notifications.model"));
const sendNotification = (app, user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const dataString = payload.data ? JSON.stringify(payload.data) : '{}';
    yield notifications_model_1.default.create({
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
        logger_1.default.info('message : FCM Notification sent successfully', response);
    }
    catch (error) {
        logger_1.default.error('error : Error sending FCM Notifications', error);
    }
});
exports.sendNotification = sendNotification;
const sendDriverNotification = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.sendNotification)(fcm_utils_1.driverApp, user, payload);
});
exports.sendDriverNotification = sendDriverNotification;
const sendCustomerNotification = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.sendNotification)(fcm_utils_1.customerApp, user, payload);
});
exports.sendCustomerNotification = sendCustomerNotification;
//# sourceMappingURL=notifications.utils.js.map