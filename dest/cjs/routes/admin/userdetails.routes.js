"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userDetails_controller_1 = __importDefault(require("../../controller/admin/userDetails.controller"));
const validation_middleware_1 = __importDefault(require("../../middleware/validation.middleware"));
const AuthGuard = __importStar(require("../../middleware/authGard"));
// import multer from 'multer';
// import { multipleFileUpload } from '../../lib/fileUpload.utils';
const router = express_1.default.Router();
// const storage = multer.memoryStorage(); // Use memory storage for simplicity; adjust as needed
// const upload = multer({ storage: storage });
router.get('/counts', AuthGuard.verifyAdminAccessToken, userDetails_controller_1.default.userCount);
router.get('/list/:role', AuthGuard.verifyAdminAccessToken, userDetails_controller_1.default.usersList);
router.get('/:user_id', AuthGuard.verifyAdminAccessToken, userDetails_controller_1.default.userDetails);
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
router.patch('/:user_id', AuthGuard.verifyAdminAccessToken, validation_middleware_1.default.validate(validation_middleware_1.default.schema.UpdateDriverAcc), userDetails_controller_1.default.updateUser);
router.patch('/vehicle/:vehicle_id', AuthGuard.verifyAdminAccessToken, validation_middleware_1.default.validate(validation_middleware_1.default.schema.AdminUpdateVehicle), userDetails_controller_1.default.updateVehicle);
router.get('/vehicles/:user_id', AuthGuard.verifyAdminAccessToken, userDetails_controller_1.default.viewVehicles);
router.get('/payment/history/:user_id', AuthGuard.verifyAdminAccessToken, userDetails_controller_1.default.paymentHistory);
router.delete('/:user_id', AuthGuard.verifyAdminAccessToken, userDetails_controller_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=userdetails.routes.js.map