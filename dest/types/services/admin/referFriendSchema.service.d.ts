import ReferFriendSection, { IReferFriendsSection } from '../../models/referFriend.model';
import { ISearch } from 'src/lib/common.interface';
declare const _default: {
    updateReferFriendSection(args: Record<string, unknown>, type: string): Promise<{
        message: string;
        referFriendSection: IReferFriendsSection;
    }>;
    getReferFriendSection(args: ISearch): Promise<{
        message: string;
        referFriendSection: ReferFriendSection[];
    }>;
};
export default _default;
