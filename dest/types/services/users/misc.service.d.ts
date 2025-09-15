import LegalContent from '../../models/legalcontent.model';
import FAQs from '../../models/faqs.model';
import { IVehicleTypes } from '../../models/vehicleTypes.model';
import { ISearch } from '../../lib/common.interface';
import { ICountryData } from '../../models/countrydata.model';
import { IContactUs } from '../../models/contactus.model';
import Testimonials from '../../models/testimonial.model';
import { IReferFriendsSection } from '../../models/referFriend.model';
import { ICategory } from '../../models/category.model';
import Blogs from '../../models/blogs.model';
import Notifications from '../../models/notifications.model';
import Coupons from '../../models/coupon.model';
import { ICareerApplications } from '../../models/careerApplications.model';
import { GooglePlaceArgs } from '../../lib/google.utils';
import Career from '../../models/careers.model';
declare const _default: {
    getLegalContent(type: string): Promise<{
        message: string;
        legalContent: LegalContent;
    }>;
    getFAQs(): Promise<{
        message: string;
        faqs: FAQs[];
    }>;
    getCareers(): Promise<{
        message: string;
        careers: Career[];
    }>;
    getAllTestimonials(): Promise<{
        message: string;
        testimonials: Testimonials[];
    }>;
    getAllBlogs(arg: ISearch): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        blog: Blogs[];
    }>;
    getBlogById(blogId: string): Promise<{
        message: string;
        blog: Blogs;
    }>;
    getReferFriendsDetails(type: string): Promise<{
        message: string;
        referFriendSection: IReferFriendsSection;
    }>;
    getAllVehicleType(): Promise<{
        message: string;
        vehicleType: IVehicleTypes[];
    }>;
    getCountryData(args: ISearch): Promise<{
        message: string;
        country: ICountryData[];
    }>;
    contactUs(args: Record<string, unknown>): Promise<{
        message: string;
        user: IContactUs;
    }>;
    applyForCareer(args: Record<string, unknown>): Promise<{
        message: string;
        application: ICareerApplications;
    }>;
    checkReferalCode(args: ISearch, role: string): Promise<{
        id: number;
        userId?: number;
        user_id: string;
        name: string;
        email: string;
        country_code: string;
        phone_number: string;
        region: string;
        referral_code: string;
        password: string;
        country: string;
        state: string;
        city: string;
        date_of_birth: Date;
        address: string;
        pincode: string;
        role: "customer" | "driver";
        profile_picture: string;
        verify_account: boolean;
        biometric_lock: boolean;
        is_business_account: boolean;
        status: string;
        registered_by: string;
        register_with: string;
        social_register_with: string;
        apple_id: string;
        refer_friends_with: string;
        fcm_token: string;
        driver_available: {
            status: boolean;
            ride: string;
        };
        ongoing_rides: {
            status: boolean;
            ride: string;
        };
        is_driver_online: boolean;
        driver_vehicle_type: string;
        driver_vehicle_category: string;
        currency: string;
        deleted_at: Date;
        message: string;
    }>;
    getCountryStateCity(): Promise<{
        message: string;
        data: {
            country: string;
            states: {
                state: string;
                cities: string[];
            }[];
        }[];
    }>;
    getAllVehilceCategories(): Promise<{
        message: string;
        vehicleCategory: ICategory[];
    }>;
    getNotifications(arg: ISearch, userId: number): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        notifications: Notifications[];
    }>;
    updateNotification(userId: number): Promise<{
        message: string;
    }>;
    deleteAllNotification(userId: number): Promise<{
        message: string;
    }>;
    getAllFeedbacks(role: string): Promise<{
        message: string;
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
    getFooter(): Promise<{
        message: string;
        footerDetails: {
            [key: string]: string;
        }[];
    }>;
    getCoupons(): Promise<{
        message: string;
        coupons: Coupons[];
    }>;
    getPopularPalces(args: GooglePlaceArgs): Promise<any>;
};
export default _default;
