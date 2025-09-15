"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const referFriend_model_1 = __importDefault(require("../../models/referFriend.model"));
const constants_1 = require("../../lib/constants");
exports.default = new (class ReferFriendSectionService {
    updateReferFriendSection(args, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let referFriendSection = yield referFriend_model_1.default.findOne({
                where: { type: type },
            });
            if (referFriendSection) {
                yield referFriend_model_1.default.update(args, { where: { type: type } });
                referFriendSection = yield referFriend_model_1.default.findOne({ where: { type: type } });
            }
            else {
                referFriendSection = yield referFriend_model_1.default.create(Object.assign({ type: type }, args));
            }
            return {
                message: constants_1.SuccessMsg.REFERFRIEND.update,
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
            const referFriendSection = yield referFriend_model_1.default.findAll({ where: filterObject });
            return {
                message: constants_1.SuccessMsg.REFERFRIEND.get,
                referFriendSection: referFriendSection,
            };
        });
    }
})();
//# sourceMappingURL=referFriendSchema.service.js.map