import { ForgotPasswordData, VerifyOtpData } from '../../middleware/validation.middleware';
import Users, { IUser } from '../../models/users.model';
declare const _default: {
    register(args: Record<string, string>, role: string): Promise<{
        message: string;
        otp: string;
    }>;
    resendOtp(args: Record<string, string | Date | number | object>): Promise<{
        message: string;
        otp: string;
    }>;
    verifyOtp(args: VerifyOtpData, type: string): Promise<{
        message: string;
        user: Users;
        token: string;
    }>;
    login(args: Record<string, string>, role: string): Promise<{
        message: string;
        otp: string;
    }>;
    me(args: Record<string, string | Date | number | object>): Promise<{
        message: string;
        user: IUser;
    }>;
    changePassword(args: Record<string, unknown>, userId: number): Promise<{
        message: string;
        user: IUser;
    }>;
    updateProfile(args: Record<string, unknown>, userId: number): Promise<{
        message: string;
        cityExist: boolean;
        user?: undefined;
    } | {
        message: string;
        user: IUser;
        cityExist?: undefined;
    }>;
    forgotPassword(args: ForgotPasswordData): Promise<{
        message: string;
        otp: string;
    }>;
    ResetPassword(args: Record<string, unknown>, userId: number): Promise<{
        message: string;
        user: IUser;
        token: string;
    }>;
    deleteUser(userId: number): Promise<{
        message: string;
    }>;
    Logout(userId: number): Promise<{
        message: string;
    }>;
};
export default _default;
