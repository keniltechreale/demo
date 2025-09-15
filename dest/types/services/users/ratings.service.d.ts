import { IRating } from '../../models/ratings.model';
declare const _default: {
    addRating(args: Record<string, unknown>, userId: number, driverId: string): Promise<{
        message: string;
        rating: IRating;
    }>;
    getAllRating(userId: string): Promise<{
        message: string;
        averageStars: string | number;
        ratingCount: number;
    }>;
};
export default _default;
