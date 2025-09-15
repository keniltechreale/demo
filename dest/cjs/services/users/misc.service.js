"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const legalcontent_model_1 = __importDefault(require("../../models/legalcontent.model"));
const faqs_model_1 = __importDefault(require("../../models/faqs.model"));
const vehicleTypes_model_1 = __importDefault(require("../../models/vehicleTypes.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const countrydata_model_1 = __importDefault(require("../../models/countrydata.model"));
const contactus_model_1 = __importDefault(require("../../models/contactus.model"));
const testimonial_model_1 = __importDefault(require("../../models/testimonial.model"));
const referFriend_model_1 = __importDefault(require("../../models/referFriend.model"));
const category_model_1 = __importDefault(require("../../models/category.model"));
const users_model_1 = __importDefault(require("../../models/users.model"));
const blogs_model_1 = __importDefault(require("../../models/blogs.model"));
const citymanagement_model_1 = __importDefault(require("../../models/citymanagement.model"));
const notifications_model_1 = __importDefault(require("../../models/notifications.model"));
const feedback_model_1 = __importDefault(require("../../models/feedback.model"));
const coupon_model_1 = __importDefault(require("../../models/coupon.model"));
const careerApplications_model_1 = __importDefault(require("../../models/careerApplications.model"));
const google_utils_1 = require("../../lib/google.utils");
const sequelize_1 = require("sequelize");
const careers_model_1 = __importDefault(require("../../models/careers.model"));
const email_utils_1 = require("../../lib/email.utils");
exports.default = new (class Miscervices {
    getLegalContent(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const legalContent = yield legalcontent_model_1.default.findOne({ where: { type: type } });
            if (!legalContent) {
                Utils.throwError(constants_1.ErrorMsg.LEGALCONTENT.notFound);
            }
            return {
                message: constants_1.SuccessMsg.LEGALCONTENT.get,
                legalContent: legalContent,
            };
        });
    }
    getFAQs() {
        return __awaiter(this, void 0, void 0, function* () {
            const faqs = yield faqs_model_1.default.findAll({
                order: [['serial_number', 'ASC']],
            });
            return {
                message: constants_1.SuccessMsg.FAQs.get,
                faqs: faqs,
            };
        });
    }
    getCareers() {
        return __awaiter(this, void 0, void 0, function* () {
            const faqs = yield careers_model_1.default.findAll({
                include: [
                    {
                        model: category_model_1.default,
                        attributes: ['id', 'name'], // choose fields you want from categories
                    },
                ],
            });
            return {
                message: constants_1.SuccessMsg.CAREERS.get,
                careers: faqs,
            };
        });
    }
    getAllTestimonials() {
        return __awaiter(this, void 0, void 0, function* () {
            const testimonialDetails = yield testimonial_model_1.default.findAll({
                where: { status: 'active' },
                order: [['createdAt', 'DESC']],
            });
            return {
                message: constants_1.SuccessMsg.TESTIMONIALS.get,
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
                    [sequelize_1.Op.or]: [
                        { title: { [sequelize_1.Op.like]: `%${search}%` } },
                        { subtitle: { [sequelize_1.Op.like]: `%${search}%` } },
                        { author: { [sequelize_1.Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield blogs_model_1.default.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const blogDetails = yield blogs_model_1.default.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            return {
                message: constants_1.SuccessMsg.BLOGS.get,
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
            const blogs = yield blogs_model_1.default.findOne({ where: { id: blogId }, raw: true });
            return {
                message: constants_1.SuccessMsg.BLOGS.get,
                blog: blogs,
            };
        });
    }
    getReferFriendsDetails(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const referFriendSection = yield referFriend_model_1.default.findOne({
                where: { type: type },
            });
            return {
                message: constants_1.SuccessMsg.REFERFRIEND.get,
                referFriendSection: referFriendSection,
            };
        });
    }
    getAllVehicleType() {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleType = yield vehicleTypes_model_1.default.findAll({
                where: { status: true },
            });
            return {
                message: constants_1.SuccessMsg.VEHICLETYPES.get,
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
            const country = yield countrydata_model_1.default.findAll({ where: filterObject });
            country.forEach((country) => {
                country.currencyCode = JSON.parse(country.currencyCode);
                country.currencyName = JSON.parse(country.currencyName);
                country.currencySymbol = JSON.parse(country.currencySymbol);
            });
            return {
                message: constants_1.SuccessMsg.USER.country,
                country: country,
            };
        });
    }
    contactUs(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const newContactUs = yield contactus_model_1.default.create(args);
            return {
                message: constants_1.SuccessMsg.CONTACTUS.add,
                user: newContactUs,
            };
        });
    }
    applyForCareer(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCareerApplication = yield careerApplications_model_1.default.create(args);
            yield (0, email_utils_1.sendCareerApplicationMail)(args);
            return {
                message: constants_1.SuccessMsg.CAREERAPPLICATIONS.add,
                application: newCareerApplication,
            };
        });
    }
    checkReferalCode(args, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findOne({
                where: { refer_friends_with: args.referral_code, role: role },
                attributes: ['name'],
                raw: true,
            });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.incorrectReferalCode);
            }
            return Object.assign({ message: constants_1.SuccessMsg.USER.referalcode }, user);
        });
    }
    getCountryStateCity() {
        return __awaiter(this, void 0, void 0, function* () {
            const countries = yield citymanagement_model_1.default.findAll({ where: { status: 'active' } });
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
                message: constants_1.SuccessMsg.CURRENCY.get,
                data: result,
            };
        });
    }
    getAllVehilceCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleCategory = yield category_model_1.default.findAll({
                where: { type: 'vehicle', status: 'active' },
                include: [
                    {
                        model: vehicleTypes_model_1.default,
                    },
                ],
                nest: true,
                raw: true,
            });
            return {
                message: constants_1.SuccessMsg.CATEGORY.get,
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
                    [sequelize_1.Op.or]: [{ title: { [sequelize_1.Op.like]: `%${search}%` } }, { body: { [sequelize_1.Op.like]: `%${search}%` } }],
                };
            }
            const totalCount = yield notifications_model_1.default.count(filterObject);
            const totalPage = Math.ceil(totalCount / limit);
            const notifications = yield notifications_model_1.default.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            return {
                message: constants_1.SuccessMsg.NOTIFICATIONS.get,
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
            const notifications = yield notifications_model_1.default.update({ isRead: true }, { where: { user: userId, isRead: false } });
            if (!notifications) {
                Utils.throwError(constants_1.ErrorMsg.LEGALCONTENT.notifynotFound);
            }
            return {
                message: constants_1.SuccessMsg.NOTIFICATIONS.update,
            };
        });
    }
    deleteAllNotification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield notifications_model_1.default.destroy({ where: { user: userId } });
            if (!notifications) {
                Utils.throwError(constants_1.ErrorMsg.LEGALCONTENT.notifynotFound);
            }
            return {
                message: constants_1.SuccessMsg.NOTIFICATIONS.delete,
            };
        });
    }
    getAllFeedbacks(role) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedbacksDetails = yield feedback_model_1.default.findAll({
                where: { role: role, status: 'active' },
                order: [['createdAt', 'DESC']],
                raw: true,
            });
            const keywordsIds = feedbacksDetails.flatMap((feedback) => feedback.keywords);
            const keywords = yield category_model_1.default.findAll({
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
                message: constants_1.SuccessMsg.FEEDBACKS.get,
                feedback: detailedfeedbacksDetails,
            };
        });
    }
    getFooter() {
        return __awaiter(this, void 0, void 0, function* () {
            const footerDetails = yield category_model_1.default.findAll({
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
                message: constants_1.SuccessMsg.CATEGORY.get,
                footerDetails: [transformedFooterDetails],
            };
        });
    }
    getCoupons() {
        return __awaiter(this, void 0, void 0, function* () {
            const coupons = yield coupon_model_1.default.findAll({ where: { status: 'active', isExpired: false } });
            return {
                message: constants_1.SuccessMsg.COUPONS.get,
                coupons,
            };
        });
    }
    getPopularPalces(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, google_utils_1.getAllGooglePlace)(args);
            return result;
        });
    }
})();
//# sourceMappingURL=misc.service.js.map