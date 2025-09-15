import { IEmergencyData } from '../../middleware/validation.middleware';
import { IEmergencyContact } from '../../models/emergencycontact.model';
declare const _default: {
    addEmergencyContact(args: IEmergencyData, userId: number): Promise<{
        message: string;
        otp: string;
    }>;
    verifyOtp(args: Record<string, unknown>, userId: number): Promise<{
        message: string;
    }>;
    resendOtp(args: Record<string, unknown>, userId: number): Promise<{
        message: string;
        otp: string;
    }>;
    getEmergencyContactById(args: Record<string, unknown>): Promise<{
        message: string;
        contact: IEmergencyContact[];
    }>;
    updateEmergencyContact(args: IEmergencyData, id: string, userId: number): Promise<{
        message: string;
        contact: IEmergencyContact;
    }>;
    deleteEmergencyContact(args: Record<string, unknown>, userId: number): Promise<{
        message: string;
    }>;
};
export default _default;
