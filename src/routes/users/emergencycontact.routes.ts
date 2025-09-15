import express from 'express';
import EmergencyContact from '../../controller/users/emergencycontact.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();

router.post(
  '/',
  AuthGuard.verifyUserAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.Emergency),
  EmergencyContact.addEmergencyContact,
);

router.post(
  '/verify/otp',
  AuthGuard.verifyUserAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.VerifyOtp),
  EmergencyContact.verifyOtp,
);

router.post(
  '/resend/otp',
  AuthGuard.verifyUserAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.ResendOtp),
  EmergencyContact.resendOtp,
);

router.get('/', AuthGuard.verifyUserAccessToken, EmergencyContact.viewEmergencyContact);
router.patch(
  '/:id',
  AuthGuard.verifyUserAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.Emergency),
  EmergencyContact.updateEmergencyContact,
);
router.delete('/:id', AuthGuard.verifyUserAccessToken, EmergencyContact.deleteEmergencyContact);

export default router;
