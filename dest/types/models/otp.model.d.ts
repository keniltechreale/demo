import { Model } from 'sequelize';
export interface IOTP {
    id: number;
    user: string;
    otp: string;
    ride: string;
    type: 'emergency_contact' | 'register' | 'forgot_password' | 'login' | 'forgot_mpin' | 'pickup' | 'delivered';
    createAt: Date;
}
declare class OTP extends Model implements IOTP {
    id: number;
    ride: string;
    user: string;
    otp: string;
    type: 'emergency_contact' | 'register' | 'forgot_password' | 'login' | 'forgot_mpin' | 'pickup' | 'delivered';
    createAt: Date;
}
export default OTP;
