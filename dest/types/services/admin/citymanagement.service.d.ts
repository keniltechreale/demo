import { ICityManagement } from '../../models/citymanagement.model';
import { ISearch } from '../../lib/common.interface';
declare const _default: {
    addCity(args: Record<string, unknown>): Promise<{
        message: string;
        city: ICityManagement;
    }>;
    getAllCity(arg: ISearch): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        city: {
            vehicleTypes: any[];
            documents: any[];
            id: number;
            country: string;
            state: string;
            city: string;
            currency: string;
            symbol: string;
            code: string;
            distanceUnit: "km" | "miles";
            status: "active" | "inactive";
            _attributes: any;
            dataValues: any;
            _creationAttributes: any;
            isNewRecord: boolean;
            sequelize: import("sequelize").Sequelize;
            _model: import("sequelize").Model<any, any>;
        }[];
    }>;
    updateCity(args: Record<string, unknown>, cityId: string): Promise<{
        message: string;
        city: ICityManagement;
    }>;
    deleteCity(cityId: string): Promise<{
        message: string;
    }>;
};
export default _default;
