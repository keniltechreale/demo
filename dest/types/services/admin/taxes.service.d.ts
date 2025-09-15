import { ITaxes } from '../../models/taxes.model';
declare const _default: {
    getTaxes(): Promise<{
        message: string;
        taxes: ITaxes[];
    }>;
    updateTaxes(args: Record<string, unknown>): Promise<{
        message: string;
        taxes: ITaxes;
    }>;
};
export default _default;
