import fcmConfig from '../config/fcm.config';
import admin from 'firebase-admin';
export const driverApp = admin.initializeApp({
    credential: admin.credential.cert({
        projectId: fcmConfig.DRIVER_PROJECT_ID,
        clientEmail: fcmConfig.DRIVER_CLIENT_EMAIL,
        privateKey: fcmConfig.DRIVER_PRIVATE_KEY,
    }),
}, 'driver_app');
export const customerApp = admin.initializeApp({
    credential: admin.credential.cert({
        projectId: fcmConfig.CUSTOMER_PROJECT_ID,
        clientEmail: fcmConfig.CUSTOMER_CLIENT_EMAIL,
        privateKey: fcmConfig.CUSTOMER_PRIVATE_KEY,
    }),
}, 'customer_app');
//# sourceMappingURL=fcm.utils.js.map