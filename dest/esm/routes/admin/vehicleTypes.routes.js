import express from 'express';
import VehicleTypesController from '../../controller/admin/vehicleTypes.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
import { singleFileUpload } from '../../lib/fileUpload.utils';
import multer from 'multer';
const router = express.Router();
const storage = multer.memoryStorage(); // Use memory storage for simplicity; adjust as needed
const upload = multer({ storage: storage });
router.post('/', AuthGuard.verifyAdminAccessToken, upload.single('vehicle_image'), singleFileUpload, ValidationMiddleware.validate(ValidationMiddleware.schema.VehicleTypes), VehicleTypesController.addVehicleTypes);
router.get('/', AuthGuard.verifyAdminAccessToken, VehicleTypesController.viewAllVehicleTypes);
router.patch('/:type_id', AuthGuard.verifyAdminAccessToken, upload.single('vehicle_image'), singleFileUpload, ValidationMiddleware.validate(ValidationMiddleware.schema.VehicleTypes), VehicleTypesController.updateVehicleTypes);
router.delete('/:type_id', AuthGuard.verifyAdminAccessToken, VehicleTypesController.deleteVehicleTypes);
export default router;
//# sourceMappingURL=vehicleTypes.routes.js.map