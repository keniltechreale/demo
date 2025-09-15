import Ratings, { IRating } from '../../models/ratings.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';

export default new (class CityService {
  async addRating(args: Record<string, unknown>, userId: number, driverId: string) {
    const existRating: IRating = await Ratings.findOne({
      where: {
        user: userId,
        driver: driverId,
      },
    });
    if (existRating) {
      Utils.throwError(ErrorMsg.RATINGS.alreadyExist);
    }

    const newRating: IRating = await Ratings.create({
      user: userId,
      driver: parseInt(driverId),
      ...args,
    });

    return {
      message: SuccessMsg.RATINGS.add,
      rating: newRating,
    };
  }

  async getAllRating(userId: string) {
    const ratingCount = await Ratings.count({ where: { driver: userId } });
    const ratingDetails = await Ratings.findAll({ where: { driver: userId } });
    let totalStars = 0;
    ratingDetails.forEach((rating) => {
      totalStars += Number(rating.stars);
    });
    const averageStars =
      ratingDetails.length > 0 ? (totalStars / ratingDetails.length).toFixed(1) : 0;

    return {
      message: SuccessMsg.RATINGS.get,
      averageStars: averageStars,
      ratingCount: ratingCount,
    };
  }
})();
