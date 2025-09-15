import { Model } from 'sequelize';
export interface ICareerApplications {
    id: number;
    career_id: number;
    name: string;
    email: string;
    phone_number?: string;
    message?: string;
    resume: string;
    status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
}
declare class CareerApplications extends Model<ICareerApplications> implements ICareerApplications {
    id: number;
    career_id: number;
    name: string;
    email: string;
    phone_number: string;
    message: string;
    resume: string;
    status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
}
export default CareerApplications;
