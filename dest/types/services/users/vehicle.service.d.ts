/// <reference types="express-serve-static-core" />
/// <reference types="multer" />
/// <reference types="passport" />
import { IVehicle } from '../../models/vehicle.model';
import { IVehicleData } from '../../middleware/validation.middleware';
declare const _default: {
    addVehicles(args: IVehicleData, userId: number): Promise<{
        message: string;
        vehicle: IVehicle;
    }>;
    getVehiclesById(args: Record<string, unknown>): Promise<{
        message: string;
        vehicle: IVehicle;
    }>;
    updateVehicles(args: IVehicleData, vehicleId: string, files: {
        [key: string]: Express.Multer.File[];
    }): Promise<{
        message: string;
        vehicle: IVehicle;
    }>;
    deleteVehicles(args: Record<string, unknown>): Promise<{
        message: string;
    }>;
};
export default _default;
