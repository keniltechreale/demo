import express from 'express';
import RidesController from '../../controller/admin/rides.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();
router.get('/', AuthGuard.verifyAdminAccessToken, RidesController.viewAllRides);
router.get('/:ride_id', AuthGuard.verifyAdminAccessToken, RidesController.viewRides);
router.patch('/:ride_id', AuthGuard.verifyAdminAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.UpdateRideStatus), RidesController.UpdateRides);
router.get('/:role/history/:user_id', AuthGuard.verifyAdminAccessToken, RidesController.viewRidesHistory);
export default router;
//# sourceMappingURL=rides.routes.js.map