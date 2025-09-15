import express from 'express';
import DriverController from '../../controller/users/delivery.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();

router.get('/documents', AuthGuard.verifyUserAccessToken, DriverController.GetDocuments);

router.get('/dashboard', AuthGuard.verifyUserAccessToken, DriverController.dashboard);
router.get(
  '/instructions',
  AuthGuard.verifyUserAccessToken,
  DriverController.viewCustomerInstructions,
);

router.post(
  '/connection/status',
  AuthGuard.verifyUserAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.ChangeConnectionStatus),
  DriverController.ChangeConnectionStatus,
);

router.post(
  '/rides/request/:ride_id/:type',
  AuthGuard.verifyUserAccessToken,
  DriverController.rideRequest,
);

router.post(
  '/verify/request/:ride_id',
  AuthGuard.verifyUserAccessToken,
  DriverController.verifyRidesOtp,
);

router.get(
  '/instructions/:ride_id',
  AuthGuard.verifyUserAccessToken,
  DriverController.viewCustomerInstructions,
);

router.get('/statistics', AuthGuard.verifyUserAccessToken, DriverController.viewStatistics);

router.post(
  '/distance/counts/:ride_id',
  AuthGuard.verifyUserAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.GoOnline),
  DriverController.DistanceCount,
);

export default router;
