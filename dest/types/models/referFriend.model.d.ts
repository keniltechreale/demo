import { Model } from 'sequelize';
export interface IReferFriendsSection {
    id: number;
    type: string;
    title: string;
    subTitle: string;
    code: string;
    description: string;
    walletAmount: number;
}
declare class ReferFriendsSection extends Model<IReferFriendsSection> implements IReferFriendsSection {
    id: number;
    type: string;
    title: string;
    subTitle: string;
    code: string;
    description: string;
    walletAmount: number;
}
export default ReferFriendsSection;
