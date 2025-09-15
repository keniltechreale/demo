import LegalContent from '../../models/legalcontent.model';
import Notifications, { INotification } from '../../models/notifications.model';
import { ISearch } from '../../lib/common.interface';
import ContactUs from '../../models/contactus.model';
declare const _default: {
    updateLegalContent(args: Record<string, unknown>, type: string): Promise<{
        message: string;
        legalContent: LegalContent;
    }>;
    getLegalContent(type: string): Promise<{
        message: string;
        legalContent: LegalContent;
    }>;
    getNotifications(arg: ISearch, adminId: number): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        notifications: INotification[];
    }>;
    updateNotification(args: Record<string, unknown>, notifyId: string): Promise<{
        message: string;
        notifications: Notifications;
    }>;
    getContactUs(arg: ISearch): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        contactus: ContactUs[];
    }>;
    sendContactUsReply(args: Record<string, string>, contactusId: string): Promise<{
        message: string;
    }>;
};
export default _default;
