import express from 'express';
import AddressController from '../../controller/users/useraddress.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();

router.post(
  '/address',
  AuthGuard.verifyUserAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.UserAddress),
  AddressController.addAddress,
);

router.get('/address', AuthGuard.verifyUserAccessToken, AddressController.viewAllAddress);

router.patch(
  '/address/:address_id',
  AuthGuard.verifyUserAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.UserAddress),
  AddressController.updateAddress,
);

router.delete(
  '/address/:address_id',
  AuthGuard.verifyUserAccessToken,
  AddressController.deleteAddress,
);

router.post('/countries', AddressController.addCountry);

export default router;
