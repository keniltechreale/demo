"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerApp = exports.driverApp = void 0;
const fcm_config_1 = __importDefault(require("../config/fcm.config"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
exports.driverApp = firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert({
        projectId: fcm_config_1.default.DRIVER_PROJECT_ID,
        clientEmail: fcm_config_1.default.DRIVER_CLIENT_EMAIL,
        privateKey: fcm_config_1.default.DRIVER_PRIVATE_KEY,
    }),
}, 'driver_app');
exports.customerApp = firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert({
        projectId: fcm_config_1.default.CUSTOMER_PROJECT_ID,
        clientEmail: fcm_config_1.default.CUSTOMER_CLIENT_EMAIL,
        privateKey: fcm_config_1.default.CUSTOMER_PRIVATE_KEY,
    }),
}, 'customer_app');
//# sourceMappingURL=fcm.utils.js.map