import Careers, { ICareer } from '../../models/careers.model';
import { ISearch } from '../../lib/common.interface';
import CareerApplications from '../../models/careerApplications.model';
declare const _default: {
    addCareers(args: Record<string, unknown>): Promise<{
        message: string;
        careers: ICareer;
    }>;
    getAllCareers(arg: ISearch): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        careers: Careers[];
    }>;
    updateCareers(args: Record<string, unknown>, careersId: string): Promise<{
        message: string;
        careers: ICareer;
    }>;
    deleteCareers(args: Record<string, unknown>): Promise<{
        message: string;
    }>;
    getCareerApplicationsByCareerId(arg: ISearch): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        applications: CareerApplications[];
    }>;
};
export default _default;
