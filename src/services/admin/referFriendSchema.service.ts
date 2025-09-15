import ReferFriendSection, { IReferFriendsSection } from '../../models/referFriend.model';
import { SuccessMsg } from '../../lib/constants';
import { ISearch } from 'src/lib/common.interface';

export default new (class ReferFriendSectionService {
  async updateReferFriendSection(args: Record<string, unknown>, type: string) {
    let referFriendSection: IReferFriendsSection = await ReferFriendSection.findOne({
      where: { type: type },
    });

    if (referFriendSection) {
      await ReferFriendSection.update(args, { where: { type: type } });
      referFriendSection = await ReferFriendSection.findOne({ where: { type: type } });
    } else {
      referFriendSection = await ReferFriendSection.create({ type: type, ...args });
    }
    return {
      message: SuccessMsg.REFERFRIEND.update,
      referFriendSection: referFriendSection,
    };
  }

  async getReferFriendSection(args: ISearch) {
    const filterObject: Record<string, unknown> = {};
    if (args.type) {
      filterObject.type = args.type;
    }
    const referFriendSection = await ReferFriendSection.findAll({ where: filterObject });
    return {
      message: SuccessMsg.REFERFRIEND.get,
      referFriendSection: referFriendSection,
    };
  }
})();
