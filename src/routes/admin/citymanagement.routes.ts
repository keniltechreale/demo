import express from 'express';
import CityController from '../../controller/admin/citymanagement.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();

router.post(
  '/',
  AuthGuard.verifyAdminAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.CityManagement),
  CityController.addCity,
);

router.get('/', AuthGuard.verifyAdminAccessToken, CityController.viewAllCity);

router.patch(
  '/:city_id',
  AuthGuard.verifyAdminAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.CityManagement),
  CityController.updateCity,
);

router.delete('/:city_id', AuthGuard.verifyAdminAccessToken, CityController.deleteCity);

export default router;
