import { Model } from 'sequelize';
export interface IVehicleTypes {
    id: number;
    name: string;
    vehicle_image: string;
    passengerCapacity: number;
    status: boolean;
    description: string;
}
declare class VehicleTypes extends Model implements IVehicleTypes {
    id: number;
    name: string;
    vehicle_image: string;
    passengerCapacity: number;
    status: boolean;
    description: string;
}
export default VehicleTypes;
