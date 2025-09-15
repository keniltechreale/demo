import VehicleTypes, { IVehicleTypes } from '../../models/vehicleTypes.model';
import { ISearch } from '../../lib/common.interface';
declare const _default: {
    addVehicleTypes(args: Record<string, unknown>): Promise<{
        message: string;
        vehicletype: IVehicleTypes;
    }>;
    getAllVehicleTypes(arg: ISearch): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        vehicletype: VehicleTypes[];
    }>;
    updateVehicleTypes(args: Record<string, unknown>, typeId: string): Promise<{
        message: string;
        vehicletype: IVehicleTypes;
    }>;
    deleteVehicleTypes(args: Record<string, unknown>): Promise<{
        message: string;
    }>;
};
export default _default;
