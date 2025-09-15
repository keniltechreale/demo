import { IFeedbacks } from '../../models/feedback.model';
import { ISearch } from '../../lib/common.interface';
declare const _default: {
    addFeedbacks(args: Record<string, unknown>): Promise<{
        message: string;
        feedback: IFeedbacks;
    }>;
    getAllFeedbacks(arg: ISearch): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        feedback: {
            keywords: any[];
            id: number;
            question: string;
            status: "active" | "inactive";
            role: "customer" | "driver";
            _attributes: any;
            dataValues: any;
            _creationAttributes: any;
            isNewRecord: boolean;
            sequelize: import("sequelize").Sequelize;
            _model: import("sequelize").Model<any, any>;
        }[];
    }>;
    updateFeedbacks(args: Record<string, unknown>, feedbackId: string): Promise<{
        message: string;
        feedbacks: IFeedbacks;
    }>;
    deleteFeedbacks(args: Record<string, unknown>): Promise<{
        message: string;
    }>;
};
export default _default;
