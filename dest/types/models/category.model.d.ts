import { Model } from 'sequelize';
import { IVehicleTypes } from './vehicleTypes.model';
export interface ICategory {
    id: number;
    name: string;
    image: string;
    passengerCapacity: string;
    vehicleType: string;
    description: string;
    type: 'career' | 'vehicle' | 'feedback' | 'footer';
    status: 'active' | 'inactive';
    link: string;
    VehicleTypes?: IVehicleTypes;
}
declare class Category extends Model implements ICategory {
    id: number;
    name: string;
    description: string;
    image: string;
    passengerCapacity: string;
    vehicleType: string;
    type: 'career' | 'vehicle' | 'feedback' | 'footer';
    status: 'active' | 'inactive';
    link: string;
    VehicleTypes?: IVehicleTypes;
}
export default Category;
