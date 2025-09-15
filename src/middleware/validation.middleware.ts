import Joi from 'joi';
import * as Utils from '../lib/utils';

// Import types for accurate typing
import { Request, Response, NextFunction } from 'express';

export interface IAdminLoginData {
  email: string;
  password: string;
}
export interface DocumentsData {
  title: string;
  key: string;
  maxFileCounts: number;
  maxSize: number;
  description?: string;
  isRequired?: boolean;
  status?: boolean;
  vehicleTypes?: number[];
}

export interface IVehicleTypesData {
  name: string;
  vehicle_image: string;
  passengerCapacity: number;
  status: boolean;
  description: string;
}

export interface ForgotPasswordData {
  email?: string;
  country_code?: string;
  phone_number?: string;
}

export interface ResetMPindata {
  mpin: string;
}
export interface VerifyOtpData {
  country_code: string;
  phone_number: string;
  otp: string;
}

export interface ChangePasswordData {
  oldPassword?: string;
  newPassword?: string;
}

export interface IAppleLogindata {
  apple_id: string;
}

export interface ResetPasswordData {
  password: string;
}

export interface IUpdateVehicle {
  status: boolean;
  type: string;
  reason: string;
  category: number;
}

export interface IUpdateDriverAcc {
  status: string;
}
export interface IRidesData {
  origin: string;
  destination: string;
  date: Date;
  pickupTime: string;
  numberOfPassengers: number;
  paymentMethod: string;
  status: string;
  customerFeedBack: [{ question: string; keyword: string; rate: number }];
  driverFeedBack: [{ question: string; keyword: string; rate: number }];
  customerComment: string;
  driverComment: string;
  mapScreenshot?: string;
}
export interface ContactUsData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  message: string;
}
export interface ICareerApplicationData {
  career_id: number;
  name: string;
  email: string;
  phone_number?: string;
  message?: string;
  resume: string;
}
export interface IReferFriendsData {
  type: string;
  title: string;
  subTitle: string;
  code: number;
  description: string;
  walletAmount: number;
}

export interface IRatingData {
  type: string;
  comment: string;
  reason: string;
  stars: number;
}

export interface ICareer {
  title: string;
  role: string;
  description: string;
  location: string;
  requirements: string;
  salaryRange?: string;
  category: string;
  postedDate: Date;
}

export interface ICategory {
  name: string;
  description: string;
  status: 'active' | 'inactive';
  image: string;
  passengerCapacity: string;
  vehicleType: number;
  stars?: number;
  keywords: string;
  role: string;
  link: string;
}
export interface IFeedbacksData {
  question: string;
  keywords: string[];
  status: string;
  role: string;
}
export interface PincodeData {
  postcodeStart: string | null;
  postcodeEnd: string | null;
  region: string | null;
  isocode: string | null;
  state: string | null;
  city: string | null;
  country: string | null;
  dialcode: string | null;
  currency: string | null;
  documents: unknown;
}

export interface FAQsData {
  question: string;
  answer: string;
  status: string;
  serial_number: number;
}

export interface ITestimonialData {
  image: string;
  name: string;
  description: string;
  status: string;
}

export interface IBlogData {
  image: string;
  title: string;
  subtitle: string;
  author: string;
  author_image: string;
  description: string;
  status: 'active' | 'inactive';
}
export interface IUserRegisterData {
  email: string;
  name: string;
  country_code: string;
  phone_number: string;
  referral_code: string;
  profile_picture: string;
  accessToken: string;
  apple_id?: string;
  pincode: string;
  date_of_birth: Date;
  region?: string;
  fcm_token?: string;
  currency?: string;
}

export interface IUpdateProfileData {
  name: string;
  email: string;
  country_code: string;
  biometric_lock: string;
  phone_number: string;
  profile_picture: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  date_of_birth: Date;
  address: string;
}
export interface VerifyDocumentRequest {
  type: string;
  verify: boolean;
}

export interface ISocialLogin {
  accessToken: string;
}
export interface IGoOnline {
  latitude: string;
  longitude: string;
}
export interface IUserAddress {
  type: string;
  name: string;
  address: string;
  pin_code: string;
  mobile_number: string;
}

export interface IBuisnessAccountData {
  businessName: string;
  category: string;
  product_category: string;
  businessAddress: string;
  country: string;
  isBusinessRegistered: boolean | string;
  registerNumber: string;
}

export interface ILanguageData {
  name: string;
  isoCode: string;
  direction: string;
  status: string;
  nativeName: string;
  speakers: number;
  script: string | null;
  dialects: string[];
  officialStatus: boolean;
}

export interface ICityManagement {
  vehicleTypes?: number[];
  country: string;
  state: string;
  city: number;
  currency: string;
  symbol: string;
  code: string;
  distanceUnit: 'km' | 'miles';
  status: 'active' | 'inactive';
  documents: number[];
}
export interface IPriceManagement {
  vehicleType: number;
  vehicleCategory: number;
  country: string;
  state: string;
  city: number;
  currency: string;
  currencySymbol: string;
  pricePerKg: number | null;
  pricePerKm?: number | null;
  pricePerMin?: number | null;
  minimumFareUSD: number;
  baseFareUSD: number;
  scheduleRideCharges: number;
  commissionPercentage: number;
  userCancellationTimeLimit: number;
  userCancellationCharges: number;
  waitingTimeLimit: number;
  waitingChargesUSD: number;
  nightCharges: boolean;
  priceNightCharges: number;
  nightStartTime?: string;
  nightEndTime?: string;
  status: 'active' | 'inactive';
}

export interface IChangeConnectionStatus {
  showCard: boolean;
  latitude: string;
  longitude: string;
  status: boolean;
}

export interface IUserLogindata {
  country_code: string;
  phone_number: string;
  fcm_token: string;
  mpin: string;
}
export interface IVehicleData {
  type: number;
  vehicle_platenumber: string;
  vehicle_model: string;
  vehicle_color: string;
  documents: {
    title: string;
    name: string;
    url: string[];
    status: 'pending' | 'approved' | 'rejected';
    reason: string;
  }[];
  showCard?: boolean;
}

export interface IPaymentData {
  amount: number;
  currency: string;
  paymentMethod: string;
  purpose: string;
  type: string;
  cardDetails?: object;
}

export interface IEarningsQuery {
  startDate: string;
  endDate: string;
}

export interface ITaxesData {
  amount: number;
  type: 'percentage' | 'fixed';
  is_active?: boolean;
}

export interface IBankAccounts {
  holderName: string;
  bankName: string;
  routingNumber: string;
  bankCode: string;
  branchCode: string;
  accountNumber: string;
  dateOfBirth: Date;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  status: 'active' | 'inactive' | 'onhold' | 'transactionInProcess';
}

export interface ILegalContentdata {
  content: string;
}

export interface IEmergencyData {
  country_code: string;
  phone_number: string;
  contact_name: string;
  isoCode: string;
  relationship: string;
  user_id: number;
  email: string;
}

export interface IAdditionalFee {
  id: number;
  type: 'VAT' | 'PlatformFee' | 'AdminFee';
  percentage: number;
  status: 'active' | 'inactive';
  applyOn: 'ride_total' | 'cashout';
}

export interface IReferralData {
  id?: number;
  referrer_id: number;
  referee_id?: number | null;
  referral_code: string;
  status?: 'pending' | 'completed' | 'expired';
  valid_until?: Date | null;
  referrer_use_count?: number;
  referee_use_count?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ValidationMiddleware {
  validate: (schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction) => void;
  schema: {
    AdminLogin: Joi.ObjectSchema;
    ForgotPassword: Joi.ObjectSchema;
    VerifyOtp: Joi.ObjectSchema;
    ResendOtp: Joi.ObjectSchema;
    AdminVerifyOtp: Joi.ObjectSchema;
    ResetPassword: Joi.ObjectSchema;
    UserRegister: Joi.ObjectSchema;
    UpdateProfile: Joi.ObjectSchema;
    UserLogin: Joi.ObjectSchema;
    ChangePassword: Joi.ObjectSchema;
    Vehicle: Joi.ObjectSchema;
    UpdateVehicle: Joi.ObjectSchema;
    UpdateDriverAcc: Joi.ObjectSchema;
    AdminUpdateVehicle: Joi.ObjectSchema;
    BusinessAccount: Joi.ObjectSchema;
    LegalContent: Joi.ObjectSchema;
    UserForgotPassword: Joi.ObjectSchema;
    ResetMpin: Joi.ObjectSchema;
    UserAddress: Joi.ObjectSchema;
    SocialLogin: Joi.ObjectSchema;
    AppleLogin: Joi.ObjectSchema;
    AppleRegister: Joi.ObjectSchema;
    GoOnline: Joi.ObjectSchema;
    VehicleTypes: Joi.ObjectSchema;
    Documents: Joi.ObjectSchema;
    Languages: Joi.ObjectSchema;
    FAQs: Joi.ObjectSchema;
    Pincode: Joi.ObjectSchema;
    CityManagement: Joi.ObjectSchema;
    PriceManagement: Joi.ObjectSchema;
    ChangeConnectionStatus: Joi.ObjectSchema;
    Emergency: Joi.ObjectSchema;
    UpdateRideStatus: Joi.ObjectSchema;
    ContactUs: Joi.ObjectSchema;
    Testimonial: Joi.ObjectSchema;
    Blogs: Joi.ObjectSchema;
    ReferFriends: Joi.ObjectSchema;
    Rides: Joi.ObjectSchema;
    UpdateRides: Joi.ObjectSchema;
    Ratings: Joi.ObjectSchema;
    Category: Joi.ObjectSchema;
    Careers: Joi.ObjectSchema;
    CareerApplication: Joi.ObjectSchema;
    FeedBack: Joi.ObjectSchema;
    TransferFunds: Joi.ObjectSchema;
    Coupons: Joi.ObjectSchema;
    RedeemCoupon: Joi.ObjectSchema;
    Payment: Joi.ObjectSchema;
    Webhook: Joi.ObjectSchema;
    EarningsQuery: Joi.ObjectSchema;
    BankAccount: Joi.ObjectSchema;
    CashoutRequest: Joi.ObjectSchema;
    Taxes: Joi.ObjectSchema;
    AdditionalFee: Joi.ObjectSchema;
    Referral: Joi.ObjectSchema;
  };
}

const validationMiddleware: ValidationMiddleware = {
  validate: (schema: Joi.Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!schema) {
        return next();
      }

      const validationOptions = {
        errors: {
          wrap: { label: '' },
        },
        abortEarly: false,
      };

      const data: Record<string, unknown> =
        req.method === 'GET'
          ? (req.query as Record<string, unknown>)
          : (req.body as Record<string, unknown>);

      (schema as Joi.ObjectSchema<unknown>)
        .validateAsync(data, validationOptions)
        .then((result) => {
          req.body = result as Record<string, unknown>;
          next();
        })
        .catch((error) => {
          if (error instanceof Joi.ValidationError) {
            res
              .status(Utils.statusCode.UNPROCESSABLE_ENTITY)
              .send(Utils.sendErrorResponse(Utils.getErrorMsg(error.message)));
          } else {
            next(error);
          }
        });
    };
  },
  schema: {
    AdminLogin: Joi.object<IAdminLoginData>().keys({
      email: Joi.string().trim().lowercase().email().required(),
      password: Joi.string().min(6).required(),
    }),
    ForgotPassword: Joi.object<ForgotPasswordData>().keys({
      email: Joi.string().trim().lowercase().email().required(),
    }),
    AdminVerifyOtp: Joi.object<VerifyOtpData>().keys({
      otp: Joi.string().trim().required(),
    }),
    VerifyOtp: Joi.object<VerifyOtpData>().keys({
      country_code: Joi.string().required(),
      phone_number: Joi.string().required(),
      otp: Joi.string().trim().required(),
    }),
    ResendOtp: Joi.object<VerifyOtpData>().keys({
      country_code: Joi.string().required(),
      phone_number: Joi.string().required(),
    }),
    ResetPassword: Joi.object<ResetPasswordData>().keys({
      password: Joi.string().min(6).required(),
    }),
    UserRegister: Joi.object<IUserRegisterData>().keys({
      name: Joi.string(),
      email: Joi.string().trim().lowercase().email().required(),
      country_code: Joi.string().required(),
      phone_number: Joi.string().required(),
      referral_code: Joi.string().allow('', null),
      profile_picture: Joi.any().allow(null, ''),
      region: Joi.string(),
      pincode: Joi.string(),
      date_of_birth: Joi.date()
        .max(new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()))
        .allow(null, '')
        .messages({
          'date.base': 'Please enter a valid date of birth.',
          'date.max': 'You must be at least 18 years old to register.',
        }),
      fcm_token: Joi.string().allow('', null),
      currency: Joi.string(),
    }),
    ChangePassword: Joi.object<ChangePasswordData>().keys({
      oldPassword: Joi.string().min(6).required(),
      newPassword: Joi.string().min(6).required(),
    }),
    UserLogin: Joi.object<IUserLogindata>().keys({
      country_code: Joi.string().required(),
      phone_number: Joi.string().required(),
      fcm_token: Joi.string().allow('', null),
      mpin: Joi.string(),
    }),
    UserForgotPassword: Joi.object<ForgotPasswordData>().keys({
      country_code: Joi.string().trim().required(),
      phone_number: Joi.string().trim().required(),
    }),
    ResetMpin: Joi.object<ResetMPindata>().keys({
      mpin: Joi.string().length(4).required(),
    }),
    UpdateProfile: Joi.object<IUpdateProfileData>().keys({
      name: Joi.string(),
      email: Joi.string().trim().lowercase().email(),
      country_code: Joi.string(),
      phone_number: Joi.string(),
      profile_picture: Joi.string().allow('', null),
      biometric_lock: Joi.string(),
      country: Joi.string().allow('', null),
      state: Joi.string().allow('', null),
      city: Joi.string().allow('', null),
      pincode: Joi.string().allow('', null),
      address: Joi.string().allow('', null),
      date_of_birth: Joi.date()
        .max(new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()))
        .allow(null, '')
        .messages({
          'date.base': 'Please enter a valid date of birth.',
          'date.max': 'You must be at least 18 years old to register.',
        }),
    }),
    AdminUpdateVehicle: Joi.object<IUpdateVehicle>().keys({
      type: Joi.string(),
      status: Joi.any().valid('approved', 'rejected'),
      reason: Joi.when('status', {
        is: 'rejected',
        then: Joi.string().required(),
        otherwise: Joi.string().allow('', null),
      }),
      category: Joi.number(),
    }),
    UpdateDriverAcc: Joi.object<IUpdateDriverAcc>().keys({
      status: Joi.string().valid('active', 'inactive').required(),
    }),
    Vehicle: Joi.object<IVehicleData>().keys({
      type: Joi.number(),
      vehicle_model: Joi.string(),
      vehicle_platenumber: Joi.string(),
      vehicle_color: Joi.string(),
      documents: Joi.array(),
    }),
    UpdateVehicle: Joi.object<IVehicleData>().keys({
      type: Joi.string(),
      vehicle_platenumber: Joi.string(),
      vehicle_color: Joi.string(),
      documents: Joi.array(),
      showCard: Joi.boolean(),
    }),
    BusinessAccount: Joi.object<IBuisnessAccountData>().keys({
      businessName: Joi.string(),
      category: Joi.string(),
      product_category: Joi.string(),
      businessAddress: Joi.string(),
      country: Joi.string().valid('united_kingdom', 'india', 'nigeria', 'united_states'),
      isBusinessRegistered: Joi.boolean(),
      registerNumber: Joi.string(),
    }),
    LegalContent: Joi.object<ILegalContentdata>().keys({
      content: Joi.string().required(),
    }),
    UserAddress: Joi.object<IUserAddress>().keys({
      type: Joi.string().required(),
      name: Joi.string().allow(null, ''),
      address: Joi.string(),
      pin_code: Joi.string().allow(null, ''),
      mobile_number: Joi.string().allow(null, ''),
    }),
    SocialLogin: Joi.object<ISocialLogin>().keys({
      accessToken: Joi.string().required(),
    }),
    AppleLogin: Joi.object<IAppleLogindata>().keys({
      apple_id: Joi.string().trim().required(),
    }),
    AppleRegister: Joi.object<IUserRegisterData>().keys({
      name: Joi.string(),
      email: Joi.string().trim().lowercase().email().required(),
      country_code: Joi.string().required(),
      phone_number: Joi.string().required(),
      referral_code: Joi.string().allow('', null),
      profile_picture: Joi.any().allow(null, ''),
      date_of_birth: Joi.date()
        .max(new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()))
        .allow(null, ''),
      apple_id: Joi.string(),
      currency: Joi.string(),
      region: Joi.string(),
      pincode: Joi.string(),
      fcm_token: Joi.string().allow('', null),
    }),
    GoOnline: Joi.object<IGoOnline>().keys({
      latitude: Joi.string().required(),
      longitude: Joi.string().required(),
    }),
    Documents: Joi.object<DocumentsData>({
      title: Joi.string(),
      key: Joi.string(),
      maxFileCounts: Joi.number().integer().allow(null, ''),
      maxSize: Joi.number().allow(null, ''),
      description: Joi.string(),
      isRequired: Joi.boolean(),
      status: Joi.boolean(),
      vehicleTypes: Joi.array(),
    }),
    VehicleTypes: Joi.object<IVehicleTypesData>({
      name: Joi.string(),
      vehicle_image: Joi.string(),
      passengerCapacity: Joi.number().integer(),
      status: Joi.string().valid('active', 'inactive'),
      description: Joi.string().allow('', null),
    }),
    Pincode: Joi.object<PincodeData>().keys({
      postcodeStart: Joi.string().required(),
      postcodeEnd: Joi.string().required(),
      isocode: Joi.string().allow(null).optional(),
      state: Joi.string().allow(null).optional(),
      city: Joi.string().allow(null).optional(),
      country: Joi.string().allow(null).optional(),
      dialcode: Joi.string().allow(null).optional(),
      currency: Joi.string().allow(null).optional(),
      region: Joi.string(),
      documents: Joi.array(),
    }),
    FAQs: Joi.object<FAQsData>({
      question: Joi.string(),
      answer: Joi.string(),
      status: Joi.any().valid('active', 'inactive'),
      serial_number: Joi.number().integer(),
    }),
    Testimonial: Joi.object<ITestimonialData>().keys({
      image: Joi.string().allow('', null),
      name: Joi.string(),
      description: Joi.string().allow('', null),
      status: Joi.string().allow('', null),
    }),
    Blogs: Joi.object<IBlogData>().keys({
      image: Joi.string().allow('', null),
      title: Joi.string(),
      subtitle: Joi.string(),
      author: Joi.string(),
      author_image: Joi.string(),
      description: Joi.string().allow('', null),
      status: Joi.string().allow('', null),
    }),
    Languages: Joi.object<ILanguageData>({
      name: Joi.string(),
      isoCode: Joi.string(),
      direction: Joi.string(),
      status: Joi.any().valid('active', 'inactive'),
      nativeName: Joi.string(),
      speakers: Joi.string(),
      script: Joi.string(),
      dialects: Joi.string(),
      officialStatus: Joi.boolean(),
    }),
    CityManagement: Joi.object<ICityManagement>({
      country: Joi.string(),
      vehicleTypes: Joi.array(),
      documents: Joi.array(),
      state: Joi.string(),
      city: Joi.string(),
      currency: Joi.string(),
      symbol: Joi.string(),
      code: Joi.string(),
      distanceUnit: Joi.string(),
      status: Joi.any().valid('active', 'inactive'),
    }),
    PriceManagement: Joi.object<IPriceManagement>({
      vehicleType: Joi.number().required(),
      vehicleCategory: Joi.number().required(),
      country: Joi.string(),
      state: Joi.string(),
      city: Joi.number().required(),
      currency: Joi.string(),
      currencySymbol: Joi.string(),
      pricePerKg: Joi.number().required(),
      pricePerKm: Joi.number().required(),
      pricePerMin: Joi.number().required(),
      minimumFareUSD: Joi.number().required(),
      baseFareUSD: Joi.number().required(),
      commissionPercentage: Joi.number().required(),
      userCancellationTimeLimit: Joi.number(),
      userCancellationCharges: Joi.number(),
      waitingTimeLimit: Joi.number(),
      waitingChargesUSD: Joi.number(),
      nightCharges: Joi.boolean(),
      priceNightCharges: Joi.number(),
      nightStartTime: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
        .optional(),
      nightEndTime: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
        .optional(),
      status: Joi.any().valid('active', 'inactive'),
      scheduleRideCharges: Joi.number(),
    }),
    Emergency: Joi.object<IEmergencyData>({
      country_code: Joi.string(),
      phone_number: Joi.string(),
      contact_name: Joi.string(),
      isoCode: Joi.string(),
      relationship: Joi.string().allow('', null),
      email: Joi.string().email().allow('', null),
    }),
    ChangeConnectionStatus: Joi.object<IChangeConnectionStatus>().keys({
      showCard: Joi.boolean(),
      latitude: Joi.string(),
      longitude: Joi.string(),
      status: Joi.boolean(),
    }),
    UpdateRideStatus: Joi.object<IUpdateDriverAcc>().keys({
      status: Joi.any().valid('booked', 'in_progress', 'completed', 'cancelled').required(),
    }),
    Rides: Joi.object<IRidesData>().keys({
      origin: Joi.string().max(255),
      destination: Joi.string().max(255),
      date: Joi.date(),
      numberOfPassengers: Joi.number().integer(),
      pickupTime: Joi.string(),
      paymentMethod: Joi.string(),
      status: Joi.string(),
    }),
    UpdateRides: Joi.object<IRidesData>().keys({
      status: Joi.any().valid('completed', 'cancelled', 'collectCash', 'cashPayment'),
      customerFeedBack: Joi.array().items(
        Joi.object({
          question: Joi.string(),
          keyword: Joi.string(),
          rate: Joi.number(),
        }),
      ),
      driverFeedBack: Joi.array().items(
        Joi.object({
          question: Joi.string(),
          keyword: Joi.string(),
          rate: Joi.number(),
        }),
      ),
      customerComment: Joi.string(),
      driverComment: Joi.string(),
      mapScreenshot: Joi.string(),
      paymentMethod: Joi.string(),
      date: Joi.date(),
      numberOfPassengers: Joi.number().integer(),
    }),
    ContactUs: Joi.object<ContactUsData>().keys({
      first_name: Joi.string().allow('', null),
      last_name: Joi.string().allow('', null),
      email: Joi.string().required(),
      phone_number: Joi.string(),
      message: Joi.string().required(),
    }),
    CareerApplication: Joi.object<ICareerApplicationData>().keys({
      career_id: Joi.number(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone_number: Joi.string().allow('', null),
      message: Joi.string().allow('', null),
      resume: Joi.string().required(),
    }),
    ReferFriends: Joi.object<IReferFriendsData>({
      type: Joi.string(),
      title: Joi.string(),
      subTitle: Joi.string(),
      code: Joi.string(),
      description: Joi.string(),
      walletAmount: Joi.number(),
    }),
    Ratings: Joi.object<IRatingData>({
      type: Joi.string(),
      comment: Joi.string(),
      reason: Joi.string(),
      stars: Joi.number().required(),
    }),
    Careers: Joi.object<ICareer>({
      title: Joi.string(),
      role: Joi.string(),
      description: Joi.string(),
      location: Joi.string(),
      requirements: Joi.string(),
      salaryRange: Joi.string(),
      category: Joi.number(),
      postedDate: Joi.string(),
    }),
    Category: Joi.object<ICategory>().keys({
      name: Joi.string(),
      description: Joi.string(),
      status: Joi.any().valid('active', 'inactive'),
      image: Joi.string(),
      stars: Joi.number(),
      passengerCapacity: Joi.string(),
      vehicleType: Joi.number(),
      keywords: Joi.string(),
      role: Joi.string(),
      link: Joi.string(),
    }),
    FeedBack: Joi.object<IFeedbacksData>({
      question: Joi.string(),
      keywords: Joi.array(),
      status: Joi.any().valid('active', 'inactive'),
      role: Joi.any().valid('customer', 'driver'),
    }),
    TransferFunds: Joi.object({
      amount: Joi.number().min(1).required(),
    }),
    Coupons: Joi.object({
      title: Joi.string(),
      subTitle: Joi.string(),
      usage_limit: Joi.number(),
      start_date: Joi.date(),
      end_date: Joi.date(),
      type: Joi.any().valid('percentage', 'fixed_money'),
      applicableUser: Joi.array(),
      minPurchaseAmount: Joi.number(),
      maxDiscountAmount: Joi.number(),
      applicableCategories: Joi.array(),
      isSpecificCoupon: Joi.boolean(),
      isExpired: Joi.boolean(),
      isActive: Joi.boolean(),
      count: Joi.number(),
      status: Joi.any().valid('active', 'inactive'),
    }),
    RedeemCoupon: Joi.object({
      code: Joi.string().required(),
    }),
    Payment: Joi.object<IPaymentData>({
      // amount: Joi.number().required(),
      // currency: Joi.string().required(),
      paymentMethod: Joi.string(),
      purpose: Joi.string(),
      // type: Joi.string().required(),
    }),
    Webhook: Joi.object({
      transactionId: Joi.string().required(),
    }),
    EarningsQuery: Joi.object<IEarningsQuery>({
      startDate: Joi.string().isoDate().required(),
      endDate: Joi.string().isoDate().required(),
    }),
    BankAccount: Joi.object<IBankAccounts>({
      holderName: Joi.string().required(),
      bankName: Joi.string(),
      bankCode: Joi.string(),
      branchCode: Joi.string(),
      routingNumber: Joi.string(),
      accountNumber: Joi.string().required(),
      dateOfBirth: Joi.date().required(),
      address: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      postalCode: Joi.string(),
    }),
    CashoutRequest: Joi.object({
      status: Joi.any().valid('approved', 'rejected').required(),
      payment_proof: Joi.string(),
      message: Joi.string().allow(null, ''),
    }),
    Taxes: Joi.object<ITaxesData>({
      amount: Joi.number().required(),
      type: Joi.string().valid('percentage', 'fixed').required(),
      is_active: Joi.boolean().optional(),
    }),
    AdditionalFee: Joi.object<IAdditionalFee>({
      type: Joi.string().valid('VAT', 'PlatformFee', 'AdminFee').required(),
      percentage: Joi.number().min(0).max(100).required(),
      status: Joi.string().valid('active', 'inactive').default('active'),
      applyOn: Joi.string().valid('ride_total', 'cashout').default('ride_total'),
    }),
    Referral: Joi.object<IReferralData>({
      referrer_id: Joi.number().required(),
      referee_id: Joi.number().allow(null),
      referral_code: Joi.string().max(50).required(),
      status: Joi.string().valid('pending', 'completed', 'expired').default('pending'),
      valid_until: Joi.date().allow(null),
      referrer_use_count: Joi.number().default(0),
      referee_use_count: Joi.number().default(0),
    }),
    // You can add more schemas here if needed
    // Example: UserRegistration: Joi.object<UserRegistrationData>().keys({...}),
  },
};

export default validationMiddleware;
