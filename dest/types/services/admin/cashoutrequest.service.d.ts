import CashoutRequest, { ICashoutRequests } from '../../models/cashoutRequest.model';
import { ISearch } from '../../lib/common.interface';
declare const _default: {
    getAllCashoutRequest(arg: ISearch): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        cashoutRequest: CashoutRequest[];
    }>;
    updateCashoutRequest(args: Record<string, unknown>, cashoutRequestId: string): Promise<{
        message: string;
        cashoutRequest: ICashoutRequests;
    }>;
};
export default _default;
