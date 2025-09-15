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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const Utils = __importStar(require("../lib/utils"));
const validationMiddleware = {
    validate: (schema) => {
        return (req, res, next) => {
            if (!schema) {
                return next();
            }
            const validationOptions = {
                errors: {
                    wrap: { label: '' },
                },
                abortEarly: false,
            };
            const data = req.method === 'GET'
                ? req.query
                : req.body;
            schema
                .validateAsync(data, validationOptions)
                .then((result) => {
                req.body = result;
                next();
            })
                .catch((error) => {
                if (error instanceof joi_1.default.ValidationError) {
                    res
                        .status(Utils.statusCode.UNPROCESSABLE_ENTITY)
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(error.message)));
                }
                else {
                    next(error);
                }
            });
        };
    },
    schema: {
        AdminLogin: joi_1.default.object().keys({
            email: joi_1.default.string().trim().lowercase().email().required(),
            password: joi_1.default.string().min(6).required(),
        }),
        ForgotPassword: joi_1.default.object().keys({
            email: joi_1.default.string().trim().lowercase().email().required(),
        }),
        AdminVerifyOtp: joi_1.default.object().keys({
            otp: joi_1.default.string().trim().required(),
        }),
        VerifyOtp: joi_1.default.object().keys({
            country_code: joi_1.default.string().required(),
            phone_number: joi_1.default.string().required(),
            otp: joi_1.default.string().trim().required(),
        }),
        ResendOtp: joi_1.default.object().keys({
            country_code: joi_1.default.string().required(),
            phone_number: joi_1.default.string().required(),
        }),
        ResetPassword: joi_1.default.object().keys({
            password: joi_1.default.string().min(6).required(),
        }),
        UserRegister: joi_1.default.object().keys({
            name: joi_1.default.string(),
            email: joi_1.default.string().trim().lowercase().email().required(),
            country_code: joi_1.default.string().required(),
            phone_number: joi_1.default.string().required(),
            referral_code: joi_1.default.string().allow('', null),
            profile_picture: joi_1.default.any().allow(null, ''),
            region: joi_1.default.string(),
            pincode: joi_1.default.string(),
            date_of_birth: joi_1.default.date()
                .max(new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()))
                .allow(null, '')
                .messages({
                'date.base': 'Please enter a valid date of birth.',
                'date.max': 'You must be at least 18 years old to register.',
            }),
            fcm_token: joi_1.default.string().allow('', null),
            currency: joi_1.default.string(),
        }),
        ChangePassword: joi_1.default.object().keys({
            oldPassword: joi_1.default.string().min(6).required(),
            newPassword: joi_1.default.string().min(6).required(),
        }),
        UserLogin: joi_1.default.object().keys({
            country_code: joi_1.default.string().required(),
            phone_number: joi_1.default.string().required(),
            fcm_token: joi_1.default.string().allow('', null),
            mpin: joi_1.default.string(),
        }),
        UserForgotPassword: joi_1.default.object().keys({
            country_code: joi_1.default.string().trim().required(),
            phone_number: joi_1.default.string().trim().required(),
        }),
        ResetMpin: joi_1.default.object().keys({
            mpin: joi_1.default.string().length(4).required(),
        }),
        UpdateProfile: joi_1.default.object().keys({
            name: joi_1.default.string(),
            email: joi_1.default.string().trim().lowercase().email(),
            country_code: joi_1.default.string(),
            phone_number: joi_1.default.string(),
            profile_picture: joi_1.default.string().allow('', null),
            biometric_lock: joi_1.default.string(),
            country: joi_1.default.string().allow('', null),
            state: joi_1.default.string().allow('', null),
            city: joi_1.default.string().allow('', null),
            pincode: joi_1.default.string().allow('', null),
            address: joi_1.default.string().allow('', null),
            date_of_birth: joi_1.default.date()
                .max(new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()))
                .allow(null, '')
                .messages({
                'date.base': 'Please enter a valid date of birth.',
                'date.max': 'You must be at least 18 years old to register.',
            }),
        }),
        AdminUpdateVehicle: joi_1.default.object().keys({
            type: joi_1.default.string(),
            status: joi_1.default.any().valid('approved', 'rejected'),
            reason: joi_1.default.when('status', {
                is: 'rejected',
                then: joi_1.default.string().required(),
                otherwise: joi_1.default.string().allow('', null),
            }),
            category: joi_1.default.number(),
        }),
        UpdateDriverAcc: joi_1.default.object().keys({
            status: joi_1.default.string().valid('active', 'inactive').required(),
        }),
        Vehicle: joi_1.default.object().keys({
            type: joi_1.default.number(),
            vehicle_model: joi_1.default.string(),
            vehicle_platenumber: joi_1.default.string(),
            vehicle_color: joi_1.default.string(),
            documents: joi_1.default.array(),
        }),
        UpdateVehicle: joi_1.default.object().keys({
            type: joi_1.default.string(),
            vehicle_platenumber: joi_1.default.string(),
            vehicle_color: joi_1.default.string(),
            documents: joi_1.default.array(),
            showCard: joi_1.default.boolean(),
        }),
        BusinessAccount: joi_1.default.object().keys({
            businessName: joi_1.default.string(),
            category: joi_1.default.string(),
            product_category: joi_1.default.string(),
            businessAddress: joi_1.default.string(),
            country: joi_1.default.string().valid('united_kingdom', 'india', 'nigeria', 'united_states'),
            isBusinessRegistered: joi_1.default.boolean(),
            registerNumber: joi_1.default.string(),
        }),
        LegalContent: joi_1.default.object().keys({
            content: joi_1.default.string().required(),
        }),
        UserAddress: joi_1.default.object().keys({
            type: joi_1.default.string().required(),
            name: joi_1.default.string().allow(null, ''),
            address: joi_1.default.string(),
            pin_code: joi_1.default.string().allow(null, ''),
            mobile_number: joi_1.default.string().allow(null, ''),
        }),
        SocialLogin: joi_1.default.object().keys({
            accessToken: joi_1.default.string().required(),
        }),
        AppleLogin: joi_1.default.object().keys({
            apple_id: joi_1.default.string().trim().required(),
        }),
        AppleRegister: joi_1.default.object().keys({
            name: joi_1.default.string(),
            email: joi_1.default.string().trim().lowercase().email().required(),
            country_code: joi_1.default.string().required(),
            phone_number: joi_1.default.string().required(),
            referral_code: joi_1.default.string().allow('', null),
            profile_picture: joi_1.default.any().allow(null, ''),
            date_of_birth: joi_1.default.date()
                .max(new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()))
                .allow(null, ''),
            apple_id: joi_1.default.string(),
            currency: joi_1.default.string(),
            region: joi_1.default.string(),
            pincode: joi_1.default.string(),
            fcm_token: joi_1.default.string().allow('', null),
        }),
        GoOnline: joi_1.default.object().keys({
            latitude: joi_1.default.string().required(),
            longitude: joi_1.default.string().required(),
        }),
        Documents: joi_1.default.object({
            title: joi_1.default.string(),
            key: joi_1.default.string(),
            maxFileCounts: joi_1.default.number().integer().allow(null, ''),
            maxSize: joi_1.default.number().allow(null, ''),
            description: joi_1.default.string(),
            isRequired: joi_1.default.boolean(),
            status: joi_1.default.boolean(),
            vehicleTypes: joi_1.default.array(),
        }),
        VehicleTypes: joi_1.default.object({
            name: joi_1.default.string(),
            vehicle_image: joi_1.default.string(),
            passengerCapacity: joi_1.default.number().integer(),
            status: joi_1.default.string().valid('active', 'inactive'),
            description: joi_1.default.string().allow('', null),
        }),
        Pincode: joi_1.default.object().keys({
            postcodeStart: joi_1.default.string().required(),
            postcodeEnd: joi_1.default.string().required(),
            isocode: joi_1.default.string().allow(null).optional(),
            state: joi_1.default.string().allow(null).optional(),
            city: joi_1.default.string().allow(null).optional(),
            country: joi_1.default.string().allow(null).optional(),
            dialcode: joi_1.default.string().allow(null).optional(),
            currency: joi_1.default.string().allow(null).optional(),
            region: joi_1.default.string(),
            documents: joi_1.default.array(),
        }),
        FAQs: joi_1.default.object({
            question: joi_1.default.string(),
            answer: joi_1.default.string(),
            status: joi_1.default.any().valid('active', 'inactive'),
            serial_number: joi_1.default.number().integer(),
        }),
        Testimonial: joi_1.default.object().keys({
            image: joi_1.default.string().allow('', null),
            name: joi_1.default.string(),
            description: joi_1.default.string().allow('', null),
            status: joi_1.default.string().allow('', null),
        }),
        Blogs: joi_1.default.object().keys({
            image: joi_1.default.string().allow('', null),
            title: joi_1.default.string(),
            subtitle: joi_1.default.string(),
            author: joi_1.default.string(),
            author_image: joi_1.default.string(),
            description: joi_1.default.string().allow('', null),
            status: joi_1.default.string().allow('', null),
        }),
        Languages: joi_1.default.object({
            name: joi_1.default.string(),
            isoCode: joi_1.default.string(),
            direction: joi_1.default.string(),
            status: joi_1.default.any().valid('active', 'inactive'),
            nativeName: joi_1.default.string(),
            speakers: joi_1.default.string(),
            script: joi_1.default.string(),
            dialects: joi_1.default.string(),
            officialStatus: joi_1.default.boolean(),
        }),
        CityManagement: joi_1.default.object({
            country: joi_1.default.string(),
            vehicleTypes: joi_1.default.array(),
            documents: joi_1.default.array(),
            state: joi_1.default.string(),
            city: joi_1.default.string(),
            currency: joi_1.default.string(),
            symbol: joi_1.default.string(),
            code: joi_1.default.string(),
            distanceUnit: joi_1.default.string(),
            status: joi_1.default.any().valid('active', 'inactive'),
        }),
        PriceManagement: joi_1.default.object({
            vehicleType: joi_1.default.number().required(),
            vehicleCategory: joi_1.default.number().required(),
            country: joi_1.default.string(),
            state: joi_1.default.string(),
            city: joi_1.default.number().required(),
            currency: joi_1.default.string(),
            currencySymbol: joi_1.default.string(),
            pricePerKg: joi_1.default.number().required(),
            pricePerKm: joi_1.default.number().required(),
            pricePerMin: joi_1.default.number().required(),
            minimumFareUSD: joi_1.default.number().required(),
            baseFareUSD: joi_1.default.number().required(),
            commissionPercentage: joi_1.default.number().required(),
            userCancellationTimeLimit: joi_1.default.number(),
            userCancellationCharges: joi_1.default.number(),
            waitingTimeLimit: joi_1.default.number(),
            waitingChargesUSD: joi_1.default.number(),
            nightCharges: joi_1.default.boolean(),
            priceNightCharges: joi_1.default.number(),
            nightStartTime: joi_1.default.string()
                .pattern(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
                .optional(),
            nightEndTime: joi_1.default.string()
                .pattern(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
                .optional(),
            status: joi_1.default.any().valid('active', 'inactive'),
            scheduleRideCharges: joi_1.default.number(),
        }),
        Emergency: joi_1.default.object({
            country_code: joi_1.default.string(),
            phone_number: joi_1.default.string(),
            contact_name: joi_1.default.string(),
            isoCode: joi_1.default.string(),
            relationship: joi_1.default.string().allow('', null),
            email: joi_1.default.string().email().allow('', null),
        }),
        ChangeConnectionStatus: joi_1.default.object().keys({
            showCard: joi_1.default.boolean(),
            latitude: joi_1.default.string(),
            longitude: joi_1.default.string(),
            status: joi_1.default.boolean(),
        }),
        UpdateRideStatus: joi_1.default.object().keys({
            status: joi_1.default.any().valid('booked', 'in_progress', 'completed', 'cancelled').required(),
        }),
        Rides: joi_1.default.object().keys({
            origin: joi_1.default.string().max(255),
            destination: joi_1.default.string().max(255),
            date: joi_1.default.date(),
            numberOfPassengers: joi_1.default.number().integer(),
            pickupTime: joi_1.default.string(),
            paymentMethod: joi_1.default.string(),
            status: joi_1.default.string(),
        }),
        UpdateRides: joi_1.default.object().keys({
            status: joi_1.default.any().valid('completed', 'cancelled', 'collectCash', 'cashPayment'),
            customerFeedBack: joi_1.default.array().items(joi_1.default.object({
                question: joi_1.default.string(),
                keyword: joi_1.default.string(),
                rate: joi_1.default.number(),
            })),
            driverFeedBack: joi_1.default.array().items(joi_1.default.object({
                question: joi_1.default.string(),
                keyword: joi_1.default.string(),
                rate: joi_1.default.number(),
            })),
            customerComment: joi_1.default.string(),
            driverComment: joi_1.default.string(),
            mapScreenshot: joi_1.default.string(),
            paymentMethod: joi_1.default.string(),
            date: joi_1.default.date(),
            numberOfPassengers: joi_1.default.number().integer(),
        }),
        ContactUs: joi_1.default.object().keys({
            first_name: joi_1.default.string().allow('', null),
            last_name: joi_1.default.string().allow('', null),
            email: joi_1.default.string().required(),
            phone_number: joi_1.default.string(),
            message: joi_1.default.string().required(),
        }),
        CareerApplication: joi_1.default.object().keys({
            career_id: joi_1.default.number(),
            name: joi_1.default.string().required(),
            email: joi_1.default.string().email().required(),
            phone_number: joi_1.default.string().allow('', null),
            message: joi_1.default.string().allow('', null),
            resume: joi_1.default.string().required(),
        }),
        ReferFriends: joi_1.default.object({
            type: joi_1.default.string(),
            title: joi_1.default.string(),
            subTitle: joi_1.default.string(),
            code: joi_1.default.string(),
            description: joi_1.default.string(),
            walletAmount: joi_1.default.number(),
        }),
        Ratings: joi_1.default.object({
            type: joi_1.default.string(),
            comment: joi_1.default.string(),
            reason: joi_1.default.string(),
            stars: joi_1.default.number().required(),
        }),
        Careers: joi_1.default.object({
            title: joi_1.default.string(),
            role: joi_1.default.string(),
            description: joi_1.default.string(),
            location: joi_1.default.string(),
            requirements: joi_1.default.string(),
            salaryRange: joi_1.default.string(),
            category: joi_1.default.number(),
            postedDate: joi_1.default.string(),
        }),
        Category: joi_1.default.object().keys({
            name: joi_1.default.string(),
            description: joi_1.default.string(),
            status: joi_1.default.any().valid('active', 'inactive'),
            image: joi_1.default.string(),
            stars: joi_1.default.number(),
            passengerCapacity: joi_1.default.string(),
            vehicleType: joi_1.default.number(),
            keywords: joi_1.default.string(),
            role: joi_1.default.string(),
            link: joi_1.default.string(),
        }),
        FeedBack: joi_1.default.object({
            question: joi_1.default.string(),
            keywords: joi_1.default.array(),
            status: joi_1.default.any().valid('active', 'inactive'),
            role: joi_1.default.any().valid('customer', 'driver'),
        }),
        TransferFunds: joi_1.default.object({
            amount: joi_1.default.number().min(1).required(),
        }),
        Coupons: joi_1.default.object({
            title: joi_1.default.string(),
            subTitle: joi_1.default.string(),
            usage_limit: joi_1.default.number(),
            start_date: joi_1.default.date(),
            end_date: joi_1.default.date(),
            type: joi_1.default.any().valid('percentage', 'fixed_money'),
            applicableUser: joi_1.default.array(),
            minPurchaseAmount: joi_1.default.number(),
            maxDiscountAmount: joi_1.default.number(),
            applicableCategories: joi_1.default.array(),
            isSpecificCoupon: joi_1.default.boolean(),
            isExpired: joi_1.default.boolean(),
            isActive: joi_1.default.boolean(),
            count: joi_1.default.number(),
            status: joi_1.default.any().valid('active', 'inactive'),
        }),
        RedeemCoupon: joi_1.default.object({
            code: joi_1.default.string().required(),
        }),
        Payment: joi_1.default.object({
            // amount: Joi.number().required(),
            // currency: Joi.string().required(),
            paymentMethod: joi_1.default.string(),
            purpose: joi_1.default.string(),
            // type: Joi.string().required(),
        }),
        Webhook: joi_1.default.object({
            transactionId: joi_1.default.string().required(),
        }),
        EarningsQuery: joi_1.default.object({
            startDate: joi_1.default.string().isoDate().required(),
            endDate: joi_1.default.string().isoDate().required(),
        }),
        BankAccount: joi_1.default.object({
            holderName: joi_1.default.string().required(),
            bankName: joi_1.default.string(),
            bankCode: joi_1.default.string(),
            branchCode: joi_1.default.string(),
            routingNumber: joi_1.default.string(),
            accountNumber: joi_1.default.string().required(),
            dateOfBirth: joi_1.default.date().required(),
            address: joi_1.default.string(),
            city: joi_1.default.string(),
            state: joi_1.default.string(),
            postalCode: joi_1.default.string(),
        }),
        CashoutRequest: joi_1.default.object({
            status: joi_1.default.any().valid('approved', 'rejected').required(),
            payment_proof: joi_1.default.string(),
            message: joi_1.default.string().allow(null, ''),
        }),
        Taxes: joi_1.default.object({
            amount: joi_1.default.number().required(),
            type: joi_1.default.string().valid('percentage', 'fixed').required(),
            is_active: joi_1.default.boolean().optional(),
        }),
        AdditionalFee: joi_1.default.object({
            type: joi_1.default.string().valid('VAT', 'PlatformFee', 'AdminFee').required(),
            percentage: joi_1.default.number().min(0).max(100).required(),
            status: joi_1.default.string().valid('active', 'inactive').default('active'),
            applyOn: joi_1.default.string().valid('ride_total', 'cashout').default('ride_total'),
        }),
        Referral: joi_1.default.object({
            referrer_id: joi_1.default.number().required(),
            referee_id: joi_1.default.number().allow(null),
            referral_code: joi_1.default.string().max(50).required(),
            status: joi_1.default.string().valid('pending', 'completed', 'expired').default('pending'),
            valid_until: joi_1.default.date().allow(null),
            referrer_use_count: joi_1.default.number().default(0),
            referee_use_count: joi_1.default.number().default(0),
        }),
        // You can add more schemas here if needed
        // Example: UserRegistration: Joi.object<UserRegistrationData>().keys({...}),
    },
};
exports.default = validationMiddleware;
//# sourceMappingURL=validation.middleware.js.map