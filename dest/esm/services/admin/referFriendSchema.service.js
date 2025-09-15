var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ReferFriendSection from '../../models/referFriend.model';
import { SuccessMsg } from '../../lib/constants';
export default new (class ReferFriendSectionService {
    updateReferFriendSection(args, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let referFriendSection = yield ReferFriendSection.findOne({
                where: { type: type },
            });
            if (referFriendSection) {
                yield ReferFriendSection.update(args, { where: { type: type } });
                referFriendSection = yield ReferFriendSection.findOne({ where: { type: type } });
            }
            else {
                referFriendSection = yield ReferFriendSection.create(Object.assign({ type: type }, args));
            }
            return {
                message: SuccessMsg.REFERFRIEND.update,
                referFriendSection: referFriendSection,
            };
        });
    }
    getReferFriendSection(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterObject = {};
            if (args.type) {
                filterObject.type = args.type;
            }
            const referFriendSection = yield ReferFriendSection.findAll({ where: filterObject });
            return {
                message: SuccessMsg.REFERFRIEND.get,
                referFriendSection: referFriendSection,
            };
        });
    }
})();
//# sourceMappingURL=referFriendSchema.service.js.map