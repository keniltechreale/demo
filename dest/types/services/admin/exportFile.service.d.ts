import { ISearch } from '../../lib/common.interface';
declare const _default: {
    exportCSVFiles(arg: ISearch, type: string): Promise<{
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        details: any[];
    }>;
};
export default _default;
