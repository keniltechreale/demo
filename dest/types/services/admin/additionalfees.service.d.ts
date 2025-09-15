import AdditionalFee, { IAdditionalFee } from '../../models/AdditionalFees';
import { ISearch } from '../../lib/common.interface';
declare const _default: {
    addAdditionalFee(args: Record<string, unknown>): Promise<{
        message: string;
        additionalFee: IAdditionalFee;
    }>;
    getAllAdditionalFees(arg: ISearch): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        additionalFees: AdditionalFee[];
    }>;
    updateAdditionalFee(args: Record<string, unknown>, id: string): Promise<{
        message: string;
        additionalFee: IAdditionalFee;
    }>;
    deleteAdditionalFee(args: {
        id: string;
    }): Promise<{
        message: string;
    }>;
};
export default _default;
