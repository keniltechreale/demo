/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import LegalContent from '../../models/legalcontent.model';
import FAQs from '../../models/faqs.model';
import VehicleTypes, { IVehicleTypes } from '../../models/vehicleTypes.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { ISearch } from '../../lib/common.interface';
import Countries, { ICountryData } from '../../models/countrydata.model';
import ContactUs, { IContactUs } from '../../models/contactus.model';
import Testimonials from '../../models/testimonial.model';
import ReferFriendsSection, { IReferFriendsSection } from '../../models/referFriend.model';
import Category, { ICategory } from '../../models/category.model';
import Users, { IUser } from '../../models/users.model';
import Blogs from '../../models/blogs.model';
import CityManagement from '../../models/citymanagement.model';
import Notifications from '../../models/notifications.model';
import Feedbacks from '../../models/feedback.model';
import Coupons from '../../models/coupon.model';
import CareerApplications, { ICareerApplications } from '../../models/careerApplications.model';
import { getAllGooglePlace, GooglePlaceArgs } from '../../lib/google.utils';
import { Op } from 'sequelize';
import Career from '../../models/careers.model';
import { sendCareerApplicationMail } from '../../lib/email.utils';

export default new (class Miscervices {
  async getLegalContent(type: string) {
    const legalContent = await LegalContent.findOne({ where: { type: type } });
    if (!legalContent) {
      Utils.throwError(ErrorMsg.LEGALCONTENT.notFound);
    }
    return {
      message: SuccessMsg.LEGALCONTENT.get,
      legalContent: legalContent,
    };
  }

  async getFAQs() {
    const faqs = await FAQs.findAll({
      order: [['serial_number', 'ASC']],
    });
    return {
      message: SuccessMsg.FAQs.get,
      faqs: faqs,
    };
  }

  async getCareers() {
    const faqs = await Career.findAll({
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
  }
  async getAllTestimonials() {
    const testimonialDetails = await Testimonials.findAll({
      where: { status: 'active' },
      order: [['createdAt', 'DESC']],
    });
    return {
      message: SuccessMsg.TESTIMONIALS.get,
      testimonials: testimonialDetails,
    };
  }

  async getAllBlogs(arg: ISearch) {
    const { page, limit, search, status } = arg;

    const skip = (page - 1) * limit;
    let filterObject: Record<string, unknown> = {};
    if (status) {
      filterObject.status = status;
    }
    if (search?.length > 0) {
      filterObject = {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { subtitle: { [Op.like]: `%${search}%` } },
          { author: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const totalCount = await Blogs.count({ where: filterObject });
    const totalPage = Math.ceil(totalCount / limit);
    const blogDetails = await Blogs.findAll({
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
  }
  async getBlogById(blogId: string) {
    const blogs = await Blogs.findOne({ where: { id: blogId }, raw: true });
    return {
      message: SuccessMsg.BLOGS.get,
      blog: blogs,
    };
  }
  async getReferFriendsDetails(type: string) {
    const referFriendSection: IReferFriendsSection = await ReferFriendsSection.findOne({
      where: { type: type },
    });
    return {
      message: SuccessMsg.REFERFRIEND.get,
      referFriendSection: referFriendSection,
    };
  }
  async getAllVehicleType() {
    const vehicleType: IVehicleTypes[] = await VehicleTypes.findAll({
      where: { status: true },
    });
    return {
      message: SuccessMsg.VEHICLETYPES.get,
      vehicleType: vehicleType,
    };
  }
  async getCountryData(args: ISearch) {
    const filterObject: Record<string, unknown> = {};
    if (args.code) {
      filterObject.countryCode = args.code;
    }
    if (args.name) {
      filterObject.longName = args.name;
    }
    const country: ICountryData[] = await Countries.findAll({ where: filterObject });
    country.forEach((country) => {
      country.currencyCode = JSON.parse(country.currencyCode);
      country.currencyName = JSON.parse(country.currencyName);
      country.currencySymbol = JSON.parse(country.currencySymbol);
    });
    return {
      message: SuccessMsg.USER.country,
      country: country,
    };
  }
  async contactUs(args: Record<string, unknown>) {
    const newContactUs: IContactUs = await ContactUs.create(args);

    return {
      message: SuccessMsg.CONTACTUS.add,
      user: newContactUs,
    };
  }

  async applyForCareer(args: Record<string, unknown>) {
    const newCareerApplication: ICareerApplications = await CareerApplications.create(args);
    await sendCareerApplicationMail(args);
    return {
      message: SuccessMsg.CAREERAPPLICATIONS.add,
      application: newCareerApplication,
    };
  }

  async checkReferalCode(args: ISearch, role: string) {
    const user: IUser = await Users.findOne({
      where: { refer_friends_with: args.referral_code, role: role },
      attributes: ['name'],
      raw: true,
    });
    if (!user) {
      Utils.throwError(ErrorMsg.USER.incorrectReferalCode);
    }
    return {
      message: SuccessMsg.USER.referalcode,
      ...user,
    };
  }

  async getCountryStateCity() {
    const countries = await CityManagement.findAll({ where: { status: 'active' } });

    const countryStateCityMap: { [country: string]: { [state: string]: string[] } } = {};

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
  }

  async getAllVehilceCategories() {
    const vehicleCategory: ICategory[] = await Category.findAll({
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
  }

  async getNotifications(arg: ISearch, userId: number) {
    const { page, limit, search, isRead, type } = arg;
    const skip = (page - 1) * limit;

    let filterObject: Record<string, unknown> = { user: userId };
    if (type) {
      filterObject.type = type;
    }
    if (isRead === 'read') {
      filterObject.isRead = true;
    } else if (isRead === 'unread') {
      filterObject.isRead = false;
    }
    if (search?.length > 0) {
      filterObject = {
        [Op.or]: [{ title: { [Op.like]: `%${search}%` } }, { body: { [Op.like]: `%${search}%` } }],
      };
    }
    const totalCount = await Notifications.count(filterObject);
    const totalPage = Math.ceil(totalCount / limit);
    const notifications = await Notifications.findAll({
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
  }

  async updateNotification(userId: number) {
    const notifications = await Notifications.update(
      { isRead: true },
      { where: { user: userId, isRead: false } },
    );
    if (!notifications) {
      Utils.throwError(ErrorMsg.LEGALCONTENT.notifynotFound);
    }
    return {
      message: SuccessMsg.NOTIFICATIONS.update,
    };
  }

  async deleteAllNotification(userId: number) {
    const notifications = await Notifications.destroy({ where: { user: userId } });
    if (!notifications) {
      Utils.throwError(ErrorMsg.LEGALCONTENT.notifynotFound);
    }
    return {
      message: SuccessMsg.NOTIFICATIONS.delete,
    };
  }

  async getAllFeedbacks(role: string) {
    const feedbacksDetails = await Feedbacks.findAll({
      where: { role: role, status: 'active' },
      order: [['createdAt', 'DESC']],
      raw: true,
    });
    const keywordsIds = feedbacksDetails.flatMap((feedback) => feedback.keywords);
    const keywords: ICategory[] = await Category.findAll({
      where: { id: keywordsIds },
      attributes: ['id', 'name', 'description', 'stars'],
      raw: true,
    });
    const keywordsMap = keywords.reduce(
      (acc, keyword) => {
        acc[keyword.id] = keyword;
        return acc;
      },
      {} as Record<number, any>,
    );
    const detailedfeedbacksDetails = feedbacksDetails.map((feedback) => {
      return {
        ...feedback,
        keywords: feedback.keywords.map((id: number) => keywordsMap[id]),
      };
    });
    return {
      message: SuccessMsg.FEEDBACKS.get,
      feedback: detailedfeedbacksDetails,
    };
  }

  async getFooter() {
    const footerDetails: ICategory[] = await Category.findAll({
      where: { type: 'footer', status: 'active' },
      attributes: ['id', 'name', 'link', 'description'],
    });

    const transformName = (name: string): string => {
      return name.toLowerCase().replace(/ /g, '_');
    };

    const transformedFooterDetails = footerDetails.reduce(
      (acc: { [key: string]: string }, item) => {
        const key = transformName(item.name);
        acc[key] = item.link;
        return acc;
      },
      {},
    );

    return {
      message: SuccessMsg.CATEGORY.get,
      footerDetails: [transformedFooterDetails],
    };
  }

  async getCoupons() {
    const coupons = await Coupons.findAll({ where: { status: 'active', isExpired: false } });
    return {
      message: SuccessMsg.COUPONS.get,
      coupons,
    };
  }

  async getPopularPalces(args: GooglePlaceArgs) {
    const result = await getAllGooglePlace(args);
    return result;
  }
})();
