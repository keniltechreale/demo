import Joi from 'joi';
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
    customerFeedBack: [{
        question: string;
        keyword: string;
        rate: number;
    }];
    driverFeedBack: [{
        question: string;
        keyword: string;
        rate: number;
    }];
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
declare const validationMiddleware: ValidationMiddleware;
export default validationMiddleware;
