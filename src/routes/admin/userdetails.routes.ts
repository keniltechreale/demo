import express from 'express';
import UserController from '../../controller/admin/userDetails.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
// import multer from 'multer';
// import { multipleFileUpload } from '../../lib/fileUpload.utils';

const router = express.Router();

// const storage = multer.memoryStorage(); // Use memory storage for simplicity; adjust as needed
// const upload = multer({ storage: storage });

router.get('/counts', AuthGuard.verifyAdminAccessToken, UserController.userCount);

router.get('/list/:role', AuthGuard.verifyAdminAccessToken, UserController.usersList);

router.get('/:user_id', AuthGuard.verifyAdminAccessToken, UserController.userDetails);

// router.post(
//   '/',
//   AuthGuard.verifyAdminAccessToken,
//   ValidationMiddleware.validate(ValidationMiddleware.schema.UserRegister),
//   UserController.addDriverUser,
// );

// router.post(
//   '/vehicles/:user_id',
//   AuthGuard.verifyAdminAccessToken,
//   upload.fields([
//     { name: 'vehicle_exterior_image', maxCount: 6 },
//     { name: 'vehicle_interior_image', maxCount: 6 },
//     { name: 'driving_license', maxCount: 6 },
//     { name: 'ownership_certificate', maxCount: 6 },
//     { name: 'government_issuedID', maxCount: 6 },
//     { name: 'roadworthiness', maxCount: 6 },
//     { name: 'inspection_report', maxCount: 6 },
//     { name: 'LASSRA_LASDRI_card', maxCount: 6 },
//   ]),
//   multipleFileUpload,
//   ValidationMiddleware.validate(ValidationMiddleware.schema.Vehicle),
//   UserController.addVehicle,
// );

router.patch(
  '/:user_id',
  AuthGuard.verifyAdminAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.UpdateDriverAcc),
  UserController.updateUser,
);

router.patch(
  '/vehicle/:vehicle_id',
  AuthGuard.verifyAdminAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.AdminUpdateVehicle),
  UserController.updateVehicle,
);

router.get('/vehicles/:user_id', AuthGuard.verifyAdminAccessToken, UserController.viewVehicles);

router.get(
  '/payment/history/:user_id',
  AuthGuard.verifyAdminAccessToken,
  UserController.paymentHistory,
);

router.delete('/:user_id', AuthGuard.verifyAdminAccessToken, UserController.deleteUser);

export default router;
