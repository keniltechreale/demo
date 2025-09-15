import { Model } from 'sequelize';
export interface IAdminUser {
    id: number;
    name: string;
    email: string;
    password: string;
    last_login: Date;
}
declare class Admin extends Model implements IAdminUser {
    id: number;
    name: string;
    email: string;
    password: string;
    last_login: Date;
}
export default Admin;
