import express from 'express';
import CustomerController from '../../controller/users/customer.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();
import multer from 'multer';
import { singleFileUpload } from '../../lib/fileUpload.utils';
const storage = multer.memoryStorage(); // Use memory storage for simplicity; adjust as needed
const upload = multer({ storage: storage });
router.post('/dashboard', AuthGuard.verifyUserAccessToken, CustomerController.ViewDashboard);
// router.post(
//   '/available/vehicle/:ride_id',
//   AuthGuard.verifyUserAccessToken,
//   CustomerController.AvailableVehicleTypes,
// );
router.post('/available/categories/:ride_id', AuthGuard.verifyUserAccessToken, CustomerController.AvailableVehicleCategories);
router.post('/instructions/:ride_id', AuthGuard.verifyUserAccessToken, upload.single('passengersAudioInstructions'), singleFileUpload, CustomerController.addInstructions);
router.post('/select/drivers/:ride_id', AuthGuard.verifyUserAccessToken, CustomerController.selectDrivers);
router.post('/coupons/redeem/:ride_id', AuthGuard.verifyUserAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.RedeemCoupon), CustomerController.redeemCoupon);
router.post('/coupons/:type/:ride_id', AuthGuard.verifyUserAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.RedeemCoupon), CustomerController.VerifyCoupon);
export default router;
//# sourceMappingURL=customer.routes.js.map