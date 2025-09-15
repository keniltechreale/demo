import { IAdminLoginData, ForgotPasswordData } from '../../middleware/validation.middleware';
import { IAdminUser } from '../../models/admin.model';
declare const _default: {
    login(args: IAdminLoginData): Promise<{
        message: string;
        user: IAdminUser;
        token: string;
    }>;
    me(args: Record<string, string | Date | number | object>): Promise<{
        user: IAdminUser;
    }>;
    forgotPassword(args: ForgotPasswordData): Promise<{
        message: string;
        user: IAdminUser;
        token: string;
        otp: string;
    }>;
    verifyOtp(args: Record<string, unknown>, userId: number): Promise<{
        message: string;
        user: IAdminUser;
    }>;
    resetPassword(args: Record<string, string>, userId: number): Promise<{
        message: string;
        user: IAdminUser;
    }>;
};
export default _default;
