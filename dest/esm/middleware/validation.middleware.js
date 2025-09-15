import Joi from 'joi';
import * as Utils from '../lib/utils';
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
                if (error instanceof Joi.ValidationError) {
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
        AdminLogin: Joi.object().keys({
            email: Joi.string().trim().lowercase().email().required(),
            password: Joi.string().min(6).required(),
        }),
        ForgotPassword: Joi.object().keys({
            email: Joi.string().trim().lowercase().email().required(),
        }),
        AdminVerifyOtp: Joi.object().keys({
            otp: Joi.string().trim().required(),
        }),
        VerifyOtp: Joi.object().keys({
            country_code: Joi.string().required(),
            phone_number: Joi.string().required(),
            otp: Joi.string().trim().required(),
        }),
        ResendOtp: Joi.object().keys({
            country_code: Joi.string().required(),
            phone_number: Joi.string().required(),
        }),
        ResetPassword: Joi.object().keys({
            password: Joi.string().min(6).required(),
        }),
        UserRegister: Joi.object().keys({
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
        ChangePassword: Joi.object().keys({
            oldPassword: Joi.string().min(6).required(),
            newPassword: Joi.string().min(6).required(),
        }),
        UserLogin: Joi.object().keys({
            country_code: Joi.string().required(),
            phone_number: Joi.string().required(),
            fcm_token: Joi.string().allow('', null),
            mpin: Joi.string(),
        }),
        UserForgotPassword: Joi.object().keys({
            country_code: Joi.string().trim().required(),
            phone_number: Joi.string().trim().required(),
        }),
        ResetMpin: Joi.object().keys({
            mpin: Joi.string().length(4).required(),
        }),
        UpdateProfile: Joi.object().keys({
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
        AdminUpdateVehicle: Joi.object().keys({
            type: Joi.string(),
            status: Joi.any().valid('approved', 'rejected'),
            reason: Joi.when('status', {
                is: 'rejected',
                then: Joi.string().required(),
                otherwise: Joi.string().allow('', null),
            }),
            category: Joi.number(),
        }),
        UpdateDriverAcc: Joi.object().keys({
            status: Joi.string().valid('active', 'inactive').required(),
        }),
        Vehicle: Joi.object().keys({
            type: Joi.number(),
            vehicle_model: Joi.string(),
            vehicle_platenumber: Joi.string(),
            vehicle_color: Joi.string(),
            documents: Joi.array(),
        }),
        UpdateVehicle: Joi.object().keys({
            type: Joi.string(),
            vehicle_platenumber: Joi.string(),
            vehicle_color: Joi.string(),
            documents: Joi.array(),
            showCard: Joi.boolean(),
        }),
        BusinessAccount: Joi.object().keys({
            businessName: Joi.string(),
            category: Joi.string(),
            product_category: Joi.string(),
            businessAddress: Joi.string(),
            country: Joi.string().valid('united_kingdom', 'india', 'nigeria', 'united_states'),
            isBusinessRegistered: Joi.boolean(),
            registerNumber: Joi.string(),
        }),
        LegalContent: Joi.object().keys({
            content: Joi.string().required(),
        }),
        UserAddress: Joi.object().keys({
            type: Joi.string().required(),
            name: Joi.string().allow(null, ''),
            address: Joi.string(),
            pin_code: Joi.string().allow(null, ''),
            mobile_number: Joi.string().allow(null, ''),
        }),
        SocialLogin: Joi.object().keys({
            accessToken: Joi.string().required(),
        }),
        AppleLogin: Joi.object().keys({
            apple_id: Joi.string().trim().required(),
        }),
        AppleRegister: Joi.object().keys({
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
        GoOnline: Joi.object().keys({
            latitude: Joi.string().required(),
            longitude: Joi.string().required(),
        }),
        Documents: Joi.object({
            title: Joi.string(),
            key: Joi.string(),
            maxFileCounts: Joi.number().integer().allow(null, ''),
            maxSize: Joi.number().allow(null, ''),
            description: Joi.string(),
            isRequired: Joi.boolean(),
            status: Joi.boolean(),
            vehicleTypes: Joi.array(),
        }),
        VehicleTypes: Joi.object({
            name: Joi.string(),
            vehicle_image: Joi.string(),
            passengerCapacity: Joi.number().integer(),
            status: Joi.string().valid('active', 'inactive'),
            description: Joi.string().allow('', null),
        }),
        Pincode: Joi.object().keys({
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
        FAQs: Joi.object({
            question: Joi.string(),
            answer: Joi.string(),
            status: Joi.any().valid('active', 'inactive'),
            serial_number: Joi.number().integer(),
        }),
        Testimonial: Joi.object().keys({
            image: Joi.string().allow('', null),
            name: Joi.string(),
            description: Joi.string().allow('', null),
            status: Joi.string().allow('', null),
        }),
        Blogs: Joi.object().keys({
            image: Joi.string().allow('', null),
            title: Joi.string(),
            subtitle: Joi.string(),
            author: Joi.string(),
            author_image: Joi.string(),
            description: Joi.string().allow('', null),
            status: Joi.string().allow('', null),
        }),
        Languages: Joi.object({
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
        CityManagement: Joi.object({
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
        PriceManagement: Joi.object({
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
        Emergency: Joi.object({
            country_code: Joi.string(),
            phone_number: Joi.string(),
            contact_name: Joi.string(),
            isoCode: Joi.string(),
            relationship: Joi.string().allow('', null),
            email: Joi.string().email().allow('', null),
        }),
        ChangeConnectionStatus: Joi.object().keys({
            showCard: Joi.boolean(),
            latitude: Joi.string(),
            longitude: Joi.string(),
            status: Joi.boolean(),
        }),
        UpdateRideStatus: Joi.object().keys({
            status: Joi.any().valid('booked', 'in_progress', 'completed', 'cancelled').required(),
        }),
        Rides: Joi.object().keys({
            origin: Joi.string().max(255),
            destination: Joi.string().max(255),
            date: Joi.date(),
            numberOfPassengers: Joi.number().integer(),
            pickupTime: Joi.string(),
            paymentMethod: Joi.string(),
            status: Joi.string(),
        }),
        UpdateRides: Joi.object().keys({
            status: Joi.any().valid('completed', 'cancelled', 'collectCash', 'cashPayment'),
            customerFeedBack: Joi.array().items(Joi.object({
                question: Joi.string(),
                keyword: Joi.string(),
                rate: Joi.number(),
            })),
            driverFeedBack: Joi.array().items(Joi.object({
                question: Joi.string(),
                keyword: Joi.string(),
                rate: Joi.number(),
            })),
            customerComment: Joi.string(),
            driverComment: Joi.string(),
            mapScreenshot: Joi.string(),
            paymentMethod: Joi.string(),
            date: Joi.date(),
            numberOfPassengers: Joi.number().integer(),
        }),
        ContactUs: Joi.object().keys({
            first_name: Joi.string().allow('', null),
            last_name: Joi.string().allow('', null),
            email: Joi.string().required(),
            phone_number: Joi.string(),
            message: Joi.string().required(),
        }),
        CareerApplication: Joi.object().keys({
            career_id: Joi.number(),
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            phone_number: Joi.string().allow('', null),
            message: Joi.string().allow('', null),
            resume: Joi.string().required(),
        }),
        ReferFriends: Joi.object({
            type: Joi.string(),
            title: Joi.string(),
            subTitle: Joi.string(),
            code: Joi.string(),
            description: Joi.string(),
            walletAmount: Joi.number(),
        }),
        Ratings: Joi.object({
            type: Joi.string(),
            comment: Joi.string(),
            reason: Joi.string(),
            stars: Joi.number().required(),
        }),
        Careers: Joi.object({
            title: Joi.string(),
            role: Joi.string(),
            description: Joi.string(),
            location: Joi.string(),
            requirements: Joi.string(),
            salaryRange: Joi.string(),
            category: Joi.number(),
            postedDate: Joi.string(),
        }),
        Category: Joi.object().keys({
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
        FeedBack: Joi.object({
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
        Payment: Joi.object({
            // amount: Joi.number().required(),
            // currency: Joi.string().required(),
            paymentMethod: Joi.string(),
            purpose: Joi.string(),
            // type: Joi.string().required(),
        }),
        Webhook: Joi.object({
            transactionId: Joi.string().required(),
        }),
        EarningsQuery: Joi.object({
            startDate: Joi.string().isoDate().required(),
            endDate: Joi.string().isoDate().required(),
        }),
        BankAccount: Joi.object({
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
        Taxes: Joi.object({
            amount: Joi.number().required(),
            type: Joi.string().valid('percentage', 'fixed').required(),
            is_active: Joi.boolean().optional(),
        }),
        AdditionalFee: Joi.object({
            type: Joi.string().valid('VAT', 'PlatformFee', 'AdminFee').required(),
            percentage: Joi.number().min(0).max(100).required(),
            status: Joi.string().valid('active', 'inactive').default('active'),
            applyOn: Joi.string().valid('ride_total', 'cashout').default('ride_total'),
        }),
        Referral: Joi.object({
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
//# sourceMappingURL=validation.middleware.js.map