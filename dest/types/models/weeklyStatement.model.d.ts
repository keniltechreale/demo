import { Model } from 'sequelize';
export interface IWeeklyStatement {
    id: number;
    user: number;
    file: string;
    startDate: string;
    endDate: string;
}
declare class WeeklyStatement extends Model<IWeeklyStatement> implements IWeeklyStatement {
    id: number;
    user: number;
    file: string;
    startDate: string;
    endDate: string;
}
export default WeeklyStatement;
