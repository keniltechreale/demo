import express from 'express';
import RatingController from '../../controller/users/ratings.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();
router.post('/:user_id', AuthGuard.verifyUserAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.Ratings), RatingController.addRating);
router.get('/:user_id', AuthGuard.verifyUserAccessToken, RatingController.viewAllRating);
export default router;
//# sourceMappingURL=ratings.routes.js.map