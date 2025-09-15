var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Ratings from '../../models/ratings.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
export default new (class CityService {
    addRating(args, userId, driverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existRating = yield Ratings.findOne({
                where: {
                    user: userId,
                    driver: driverId,
                },
            });
            if (existRating) {
                Utils.throwError(ErrorMsg.RATINGS.alreadyExist);
            }
            const newRating = yield Ratings.create(Object.assign({ user: userId, driver: parseInt(driverId) }, args));
            return {
                message: SuccessMsg.RATINGS.add,
                rating: newRating,
            };
        });
    }
    getAllRating(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ratingCount = yield Ratings.count({ where: { driver: userId } });
            const ratingDetails = yield Ratings.findAll({ where: { driver: userId } });
            let totalStars = 0;
            ratingDetails.forEach((rating) => {
                totalStars += Number(rating.stars);
            });
            const averageStars = ratingDetails.length > 0 ? (totalStars / ratingDetails.length).toFixed(1) : 0;
            return {
                message: SuccessMsg.RATINGS.get,
                averageStars: averageStars,
                ratingCount: ratingCount,
            };
        });
    }
})();
//# sourceMappingURL=ratings.service.js.map