var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import LegalContent from '../../models/legalcontent.model';
import FAQs from '../../models/faqs.model';
import VehicleTypes from '../../models/vehicleTypes.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import Countries from '../../models/countrydata.model';
import ContactUs from '../../models/contactus.model';
import Testimonials from '../../models/testimonial.model';
import ReferFriendsSection from '../../models/referFriend.model';
import Category from '../../models/category.model';
import Users from '../../models/users.model';
import Blogs from '../../models/blogs.model';
import CityManagement from '../../models/citymanagement.model';
import Notifications from '../../models/notifications.model';
import Feedbacks from '../../models/feedback.model';
import Coupons from '../../models/coupon.model';
import CareerApplications from '../../models/careerApplications.model';
import { getAllGooglePlace } from '../../lib/google.utils';
import { Op } from 'sequelize';
import Career from '../../models/careers.model';
import { sendCareerApplicationMail } from '../../lib/email.utils';
export default new (class Miscervices {
    getLegalContent(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const legalContent = yield LegalContent.findOne({ where: { type: type } });
            if (!legalContent) {
                Utils.throwError(ErrorMsg.LEGALCONTENT.notFound);
            }
            return {
                message: SuccessMsg.LEGALCONTENT.get,
                legalContent: legalContent,
            };
        });
    }
    getFAQs() {
        return __awaiter(this, void 0, void 0, function* () {
            const faqs = yield FAQs.findAll({
                order: [['serial_number', 'ASC']],
            });
            return {
                message: SuccessMsg.FAQs.get,
                faqs: faqs,
            };
        });
    }
    getCareers() {
        return __awaiter(this, void 0, void 0, function* () {
            const faqs = yield Career.findAll({
                include: [
                    {
                        model: Category,
                        attributes: ['id', 'name'], // choose fields you want from categories
                    },
                ],
            });
            return {
                message: SuccessMsg.CAREERS.get,
                careers: faqs,
            };
        });
    }
    getAllTestimonials() {
        return __awaiter(this, void 0, void 0, function* () {
            const testimonialDetails = yield Testimonials.findAll({
                where: { status: 'active' },
                order: [['createdAt', 'DESC']],
            });
            return {
                message: SuccessMsg.TESTIMONIALS.get,
                testimonials: testimonialDetails,
            };
        });
    }
    getAllBlogs(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status } = arg;
            const skip = (page - 1) * limit;
            let filterObject = {};
            if (status) {
                filterObject.status = status;
            }
            if ((search === null || search === void 0 ? void 0 : search.length) > 0) {
                filterObject = {
                    [Op.or]: [
                        { title: { [Op.like]: `%${search}%` } },
                        { subtitle: { [Op.like]: `%${search}%` } },
                        { author: { [Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield Blogs.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const blogDetails = yield Blogs.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            return {
                message: SuccessMsg.BLOGS.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                blog: blogDetails,
            };
        });
    }
    getBlogById(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield Blogs.findOne({ where: { id: blogId }, raw: true });
            return {
                message: SuccessMsg.BLOGS.get,
                blog: blogs,
            };
        });
    }
    getReferFriendsDetails(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const referFriendSection = yield ReferFriendsSection.findOne({
                where: { type: type },
            });
            return {
                message: SuccessMsg.REFERFRIEND.get,
                referFriendSection: referFriendSection,
            };
        });
    }
    getAllVehicleType() {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleType = yield VehicleTypes.findAll({
                where: { status: true },
            });
            return {
                message: SuccessMsg.VEHICLETYPES.get,
                vehicleType: vehicleType,
            };
        });
    }
    getCountryData(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterObject = {};
            if (args.code) {
                filterObject.countryCode = args.code;
            }
            if (args.name) {
                filterObject.longName = args.name;
            }
            const country = yield Countries.findAll({ where: filterObject });
            country.forEach((country) => {
                country.currencyCode = JSON.parse(country.currencyCode);
                country.currencyName = JSON.parse(country.currencyName);
                country.currencySymbol = JSON.parse(country.currencySymbol);
            });
            return {
                message: SuccessMsg.USER.country,
                country: country,
            };
        });
    }
    contactUs(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const newContactUs = yield ContactUs.create(args);
            return {
                message: SuccessMsg.CONTACTUS.add,
                user: newContactUs,
            };
        });
    }
    applyForCareer(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCareerApplication = yield CareerApplications.create(args);
            yield sendCareerApplicationMail(args);
            return {
                message: SuccessMsg.CAREERAPPLICATIONS.add,
                application: newCareerApplication,
            };
        });
    }
    checkReferalCode(args, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users.findOne({
                where: { refer_friends_with: args.referral_code, role: role },
                attributes: ['name'],
                raw: true,
            });
            if (!user) {
                Utils.throwError(ErrorMsg.USER.incorrectReferalCode);
            }
            return Object.assign({ message: SuccessMsg.USER.referalcode }, user);
        });
    }
    getCountryStateCity() {
        return __awaiter(this, void 0, void 0, function* () {
            const countries = yield CityManagement.findAll({ where: { status: 'active' } });
            const countryStateCityMap = {};
            countries.forEach((statistic) => {
                if (!countryStateCityMap[statistic.country]) {
                    countryStateCityMap[statistic.country] = {};
                }
                if (!countryStateCityMap[statistic.country][statistic.state]) {
                    countryStateCityMap[statistic.country][statistic.state] = [];
                }
                if (!countryStateCityMap[statistic.country][statistic.state].includes(statistic.city)) {
                    countryStateCityMap[statistic.country][statistic.state].push(statistic.city);
                }
            });
            const result = Object.entries(countryStateCityMap).map(([country, states]) => ({
                country,
                states: Object.entries(states).map(([state, cities]) => ({
                    state,
                    cities,
                })),
            }));
            return {
                message: SuccessMsg.CURRENCY.get,
                data: result,
            };
        });
    }
    getAllVehilceCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleCategory = yield Category.findAll({
                where: { type: 'vehicle', status: 'active' },
                include: [
                    {
                        model: VehicleTypes,
                    },
                ],
                nest: true,
                raw: true,
            });
            return {
                message: SuccessMsg.CATEGORY.get,
                vehicleCategory,
            };
        });
    }
    getNotifications(arg, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, isRead, type } = arg;
            const skip = (page - 1) * limit;
            let filterObject = { user: userId };
            if (type) {
                filterObject.type = type;
            }
            if (isRead === 'read') {
                filterObject.isRead = true;
            }
            else if (isRead === 'unread') {
                filterObject.isRead = false;
            }
            if ((search === null || search === void 0 ? void 0 : search.length) > 0) {
                filterObject = {
                    [Op.or]: [{ title: { [Op.like]: `%${search}%` } }, { body: { [Op.like]: `%${search}%` } }],
                };
            }
            const totalCount = yield Notifications.count(filterObject);
            const totalPage = Math.ceil(totalCount / limit);
            const notifications = yield Notifications.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            return {
                message: SuccessMsg.NOTIFICATIONS.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                notifications: notifications,
            };
        });
    }
    updateNotification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield Notifications.update({ isRead: true }, { where: { user: userId, isRead: false } });
            if (!notifications) {
                Utils.throwError(ErrorMsg.LEGALCONTENT.notifynotFound);
            }
            return {
                message: SuccessMsg.NOTIFICATIONS.update,
            };
        });
    }
    deleteAllNotification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield Notifications.destroy({ where: { user: userId } });
            if (!notifications) {
                Utils.throwError(ErrorMsg.LEGALCONTENT.notifynotFound);
            }
            return {
                message: SuccessMsg.NOTIFICATIONS.delete,
            };
        });
    }
    getAllFeedbacks(role) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedbacksDetails = yield Feedbacks.findAll({
                where: { role: role, status: 'active' },
                order: [['createdAt', 'DESC']],
                raw: true,
            });
            const keywordsIds = feedbacksDetails.flatMap((feedback) => feedback.keywords);
            const keywords = yield Category.findAll({
                where: { id: keywordsIds },
                attributes: ['id', 'name', 'description', 'stars'],
                raw: true,
            });
            const keywordsMap = keywords.reduce((acc, keyword) => {
                acc[keyword.id] = keyword;
                return acc;
            }, {});
            const detailedfeedbacksDetails = feedbacksDetails.map((feedback) => {
                return Object.assign(Object.assign({}, feedback), { keywords: feedback.keywords.map((id) => keywordsMap[id]) });
            });
            return {
                message: SuccessMsg.FEEDBACKS.get,
                feedback: detailedfeedbacksDetails,
            };
        });
    }
    getFooter() {
        return __awaiter(this, void 0, void 0, function* () {
            const footerDetails = yield Category.findAll({
                where: { type: 'footer', status: 'active' },
                attributes: ['id', 'name', 'link', 'description'],
            });
            const transformName = (name) => {
                return name.toLowerCase().replace(/ /g, '_');
            };
            const transformedFooterDetails = footerDetails.reduce((acc, item) => {
                const key = transformName(item.name);
                acc[key] = item.link;
                return acc;
            }, {});
            return {
                message: SuccessMsg.CATEGORY.get,
                footerDetails: [transformedFooterDetails],
            };
        });
    }
    getCoupons() {
        return __awaiter(this, void 0, void 0, function* () {
            const coupons = yield Coupons.findAll({ where: { status: 'active', isExpired: false } });
            return {
                message: SuccessMsg.COUPONS.get,
                coupons,
            };
        });
    }
    getPopularPalces(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield getAllGooglePlace(args);
            return result;
        });
    }
})();
//# sourceMappingURL=misc.service.js.map