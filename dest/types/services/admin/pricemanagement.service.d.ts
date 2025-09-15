import PriceManagement, { IPriceManagement } from '../../models/pricemanagement.model';
import { ISearch } from '../../lib/common.interface';
declare const _default: {
    addPriceManagement(args: Record<string, unknown>): Promise<{
        message: string;
        prices: IPriceManagement;
    }>;
    getPriceManagementById(args: Record<string, unknown>): Promise<{
        message: string;
        prices: IPriceManagement;
    }>;
    getAllPriceManagement(arg: ISearch): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        prices: PriceManagement[];
    }>;
    updatePriceManagement(args: Record<string, unknown>, priceId: string): Promise<{
        message: string;
        prices: IPriceManagement;
    }>;
    deletePriceManagement(args: Record<string, unknown>): Promise<{
        message: string;
    }>;
};
export default _default;
