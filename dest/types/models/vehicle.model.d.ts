import { Model } from 'sequelize';
import { IUser } from './users.model';
import VehicleTypes, { IVehicleTypes } from './vehicleTypes.model';
import { ICategory } from './category.model';
export interface IVehicleDocument {
    title: string;
    name: string;
    url: string[];
    status: 'pending' | 'approved' | 'rejected';
    reason: string | null;
}
export interface IVehicle {
    id: number;
    user: number;
    type: number;
    category: number;
    vehicle_platenumber?: string;
    vehicle_model: string;
    vehicle_color?: string;
    documents: IVehicleDocument[];
    verified: boolean;
    showCard: boolean;
    User?: IUser;
    pictures?: string[];
    VehicleType?: IVehicleTypes;
    Category?: ICategory;
}
declare class Vehicle extends Model<IVehicle> implements IVehicle {
    id: number;
    user: number;
    type: number;
    category: number;
    vehicle_platenumber: string | null;
    vehicle_model: string;
    vehicle_color: string | null;
    documents: IVehicleDocument[];
    verified: boolean;
    showCard: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    User?: IUser;
    VehicleType?: VehicleTypes;
}
export default Vehicle;
