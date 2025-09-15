import { Model } from 'sequelize';
export interface ICareer {
    id: number;
    title: string;
    role: string;
    description: string;
    location: string;
    requirements: string[];
    salaryRange?: string;
    postedDate: Date;
}
declare class Career extends Model implements ICareer {
    id: number;
    role: string;
    title: string;
    description: string;
    location: string;
    requirements: string[];
    salaryRange?: string;
    postedDate: Date;
    category: string;
}
export default Career;
