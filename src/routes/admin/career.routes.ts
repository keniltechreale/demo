import express from 'express';
import careersController from '../../controller/admin/careers.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();

router.post(
  '/',
  AuthGuard.verifyAdminAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.Careers),
  careersController.addCareers,
);

router.get('/', AuthGuard.verifyAdminAccessToken, careersController.viewAllCareers);

router.patch(
  '/:careers_id',
  AuthGuard.verifyAdminAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.Careers),
  careersController.updateCareers,
);

router.delete('/:careers_id', AuthGuard.verifyAdminAccessToken, careersController.deleteCareers);

router.get(
  '/applications',
  AuthGuard.verifyAdminAccessToken,
  careersController.viewCareerApplicationsByCareerId,
);

export default router;
