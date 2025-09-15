import express from 'express';
import CouponController from '../../controller/admin/coupon.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();
router.post('/', AuthGuard.verifyAdminAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.Coupons), CouponController.addCoupon);
router.get('/', AuthGuard.verifyAdminAccessToken, CouponController.viewAllCoupons);
router.patch('/:coupon_id', AuthGuard.verifyAdminAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.Coupons), CouponController.updateCoupon);
router.delete('/:coupon_id', AuthGuard.verifyAdminAccessToken, CouponController.deleteCoupon);
export default router;
//# sourceMappingURL=coupon.routes.js.map