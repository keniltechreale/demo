var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Vehicles from '../../models/vehicle.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { deleteAllFilesFromS3, deleteFilesFromS3 } from '../../lib/fileUpload.utils';
import Users from '../../models/users.model';
import VehicleTypes from '../../models/vehicleTypes.model';
import Category from '../../models/category.model';
import Admin from '../../models/admin.model';
import Notifications from '../../models/notifications.model';
export default new (class VehicleService {
    addVehicles(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existVehicle = yield Vehicles.findOne({ where: { user: userId } });
            if (existVehicle) {
                Utils.throwError(ErrorMsg.VEHICLE.alreadyExist);
            }
            const user = yield Users.findOne({ where: { id: userId } });
            args.documents.push({
                title: 'Profile Picture',
                name: 'profile_picture',
                url: [user.profile_picture],
                status: 'pending',
                reason: undefined,
            });
            const admin = yield Admin.findOne({ raw: true });
            yield Notifications.create({
                admin: admin.id,
                title: 'Vehicle Documents Uploaded',
                type: 'vehicle_documents',
                body: `Driver ${user.name} has uploaded vehicle documents.`,
                meta_data: { user: user.id },
            });
            const newVehicle = yield Vehicles.create(Object.assign({ user: userId }, args));
            const vehicleType = yield VehicleTypes.findOne({ where: { id: args.type }, raw: true });
            yield Users.update({ driver_vehicle_type: vehicleType.name }, { where: { id: userId } });
            return {
                message: SuccessMsg.Vehicle.add,
                vehicle: newVehicle,
            };
        });
    }
    getVehiclesById(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleDetails = yield Vehicles.findOne({
                where: { user: args.userId },
                include: [
                    {
                        model: VehicleTypes,
                    },
                    {
                        model: Category,
                    },
                ],
            });
            return {
                message: SuccessMsg.Vehicle.get,
                vehicle: vehicleDetails,
            };
        });
    }
    updateVehicles(args, vehicleId, files) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldDetails = yield Vehicles.findOne({ where: { id: vehicleId } });
            const vehicleDetails = yield Vehicles.findOne({ where: { id: vehicleId } });
            if (!vehicleDetails) {
                Utils.throwError(ErrorMsg.VEHICLE.notFound);
            }
            const updateObj = Object.assign({}, args);
            delete updateObj.documents;
            if (args.documents && args.documents.length > 0) {
                args.documents.forEach((argDocument) => {
                    const existingDocumentIndex = vehicleDetails.documents.findIndex((doc) => doc.name === argDocument.name);
                    if (existingDocumentIndex !== -1) {
                        vehicleDetails.documents[existingDocumentIndex] = Object.assign({}, argDocument);
                    }
                });
                updateObj.showCard = false;
                updateObj.documents = vehicleDetails.documents;
            }
            yield Vehicles.update(updateObj, { where: { id: vehicleId } });
            const updatedDetails = yield Vehicles.findOne({ where: { id: vehicleId } });
            yield deleteFilesFromS3(files, oldDetails);
            return {
                message: SuccessMsg.Vehicle.update,
                vehicle: updatedDetails,
            };
        });
    }
    deleteVehicles(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleDetails = yield Vehicles.findOne({ where: { id: args.vehicleId } });
            if (!vehicleDetails) {
                Utils.throwError(ErrorMsg.VEHICLE.notFound);
            }
            yield Vehicles.destroy({ where: { id: args.vehicleId } });
            yield deleteAllFilesFromS3(vehicleDetails);
            return {
                message: SuccessMsg.Vehicle.delete,
            };
        });
    }
})();
//# sourceMappingURL=vehicle.service.js.map