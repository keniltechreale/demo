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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vehicle_model_1 = __importDefault(require("../../models/vehicle.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const fileUpload_utils_1 = require("../../lib/fileUpload.utils");
const users_model_1 = __importDefault(require("../../models/users.model"));
const vehicleTypes_model_1 = __importDefault(require("../../models/vehicleTypes.model"));
const category_model_1 = __importDefault(require("../../models/category.model"));
const admin_model_1 = __importDefault(require("../../models/admin.model"));
const notifications_model_1 = __importDefault(require("../../models/notifications.model"));
exports.default = new (class VehicleService {
    addVehicles(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existVehicle = yield vehicle_model_1.default.findOne({ where: { user: userId } });
            if (existVehicle) {
                Utils.throwError(constants_1.ErrorMsg.VEHICLE.alreadyExist);
            }
            const user = yield users_model_1.default.findOne({ where: { id: userId } });
            args.documents.push({
                title: 'Profile Picture',
                name: 'profile_picture',
                url: [user.profile_picture],
                status: 'pending',
                reason: undefined,
            });
            const admin = yield admin_model_1.default.findOne({ raw: true });
            yield notifications_model_1.default.create({
                admin: admin.id,
                title: 'Vehicle Documents Uploaded',
                type: 'vehicle_documents',
                body: `Driver ${user.name} has uploaded vehicle documents.`,
                meta_data: { user: user.id },
            });
            const newVehicle = yield vehicle_model_1.default.create(Object.assign({ user: userId }, args));
            const vehicleType = yield vehicleTypes_model_1.default.findOne({ where: { id: args.type }, raw: true });
            yield users_model_1.default.update({ driver_vehicle_type: vehicleType.name }, { where: { id: userId } });
            return {
                message: constants_1.SuccessMsg.Vehicle.add,
                vehicle: newVehicle,
            };
        });
    }
    getVehiclesById(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleDetails = yield vehicle_model_1.default.findOne({
                where: { user: args.userId },
                include: [
                    {
                        model: vehicleTypes_model_1.default,
                    },
                    {
                        model: category_model_1.default,
                    },
                ],
            });
            return {
                message: constants_1.SuccessMsg.Vehicle.get,
                vehicle: vehicleDetails,
            };
        });
    }
    updateVehicles(args, vehicleId, files) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldDetails = yield vehicle_model_1.default.findOne({ where: { id: vehicleId } });
            const vehicleDetails = yield vehicle_model_1.default.findOne({ where: { id: vehicleId } });
            if (!vehicleDetails) {
                Utils.throwError(constants_1.ErrorMsg.VEHICLE.notFound);
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
            yield vehicle_model_1.default.update(updateObj, { where: { id: vehicleId } });
            const updatedDetails = yield vehicle_model_1.default.findOne({ where: { id: vehicleId } });
            yield (0, fileUpload_utils_1.deleteFilesFromS3)(files, oldDetails);
            return {
                message: constants_1.SuccessMsg.Vehicle.update,
                vehicle: updatedDetails,
            };
        });
    }
    deleteVehicles(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleDetails = yield vehicle_model_1.default.findOne({ where: { id: args.vehicleId } });
            if (!vehicleDetails) {
                Utils.throwError(constants_1.ErrorMsg.VEHICLE.notFound);
            }
            yield vehicle_model_1.default.destroy({ where: { id: args.vehicleId } });
            yield (0, fileUpload_utils_1.deleteAllFilesFromS3)(vehicleDetails);
            return {
                message: constants_1.SuccessMsg.Vehicle.delete,
            };
        });
    }
})();
//# sourceMappingURL=vehicle.service.js.map