import Address, { IAddress } from '../../models/useraddress.model';
declare const _default: {
    addAddress(args: Record<string, unknown>, userId: number): Promise<{
        message: string;
        address: IAddress;
    }>;
    getAllAddress(userId: number): Promise<{
        message: string;
        address: Address[];
    }>;
    updateAddress(args: Record<string, unknown>, addressId: string): Promise<{
        message: string;
        address: IAddress;
    }>;
    deleteAddress(args: Record<string, unknown>, userId: number): Promise<{
        message: string;
    }>;
    AddCountry(): Promise<{
        message: string;
    }>;
};
export default _default;
