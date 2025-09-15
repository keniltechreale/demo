export declare const ErrorMsg: {
    USER: {
        notFound: string;
        phoneAlreadyExist: string;
        appleIdAlreadyExist: string;
        emailAlreadyExist: string;
        incorrectCredentials: string;
        incorrectOtp: string;
        incorrectToken: string;
        requireAuthToken: string;
        forbidden: string;
        sessionExpire: string;
        incorrectMpin: string;
        incorrectReferalCode: string;
        samePassword: string;
        walletExist: string;
    };
    EXCEPTIONS: {
        wentWrong: string;
        notFound: string;
        accessToken: string;
        pincodeNotFound: string;
        FileSizelimit: string;
        unexpectedFile: string;
        noMatchDrivers: string;
    };
    CATEGORY: {
        notFound: string;
        alreadyExist: string;
        categoryDependency: string;
        priceDependency: string;
    };
    RIDES: {
        notFound: string;
        alreadyPaid: string;
        userBusy: string;
    };
    CAREERS: {
        notFound: string;
    };
    CAREERAPPLICATIONS: {
        notFound: string;
    };
    RATINGS: {
        notFound: string;
        alreadyExist: string;
    };
    PRICES: {
        notFound: string;
        alreadyExist: string;
        weight: string;
        nightTimeRequired: string;
    };
    CITY: {
        notFound: string;
        documentDependency: string;
        priceDependency: string;
        alreadyExist: string;
    };
    VEHICLE: {
        notFound: string;
        alreadyExist: string;
        notVerified: string;
    };
    EmergencyContact: {
        notFound: string;
        alreadyExist: string;
        unauthorized: string;
    };
    CONTACTMESSAGE: {
        notFound: string;
        alreadyReplied: string;
    };
    LEGALCONTENT: {
        notifynotFound: string;
        notFound: string;
    };
    BUSINESS: {
        notFound: string;
        alreadyExist: string;
    };
    ADDRESS: {
        notFound: string;
    };
    PINCODE: {
        notFound: string;
        alreadyExist: string;
    };
    VEHICLETYPES: {
        notFound: string;
        alreadyExist: string;
    };
    DOCUMENTS: {
        notFound: string;
        alreadyExist: string;
    };
    CURRENCY: {
        notFound: string;
        alreadyExist: string;
    };
    LANGUAGES: {
        notFound: string;
        alreadyExist: string;
    };
    FAQs: {
        notFound: string;
        alreadyExist: string;
    };
    TESTIMONIALS: {
        notFound: string;
    };
    BLOGS: {
        notFound: string;
    };
    FEEDBACKS: {
        notFound: string;
        alreadyExist: string;
    };
    COUPONS: {
        notFound: string;
        invalid: string;
        alreadyExist: string;
        expired: string;
        alreadyRedeem: string;
    };
    WALLETS: {
        notFound: string;
        alreadyExist: string;
        invalidAmount: string;
        onHoldAmount: string;
    };
    PAYMENT: {
        failed: string;
        transactionNotFound: string;
    };
    BANKACCOUNTS: {
        notFound: string;
        invalidUser: string;
        alreadyExist: string;
    };
    CASHOUT: {
        notFound: string;
        alreadyExist: string;
        cannotUpdate: string;
        imageNotFound: string;
    };
    ADDITIONAL_FEES: {
        notFound: string;
        alreadyExists: string;
        invalidType: string;
        invalidStatus: string;
    };
    REFERRAL: {
        notFound: string;
        alreadyExist: string;
        invalidCode: string;
        expired: string;
        maxUseReached: string;
    };
};
export declare const SuccessMsg: {
    USER: {
        get: string;
        count: string;
        login: string;
        profile: string;
        logout: string;
        sendOtp: string;
        verifyOtp: string;
        passwordUpdated: string;
        register: string;
        update: string;
        country: string;
        referalcode: string;
        mail: string;
        delete: string;
        statistic: string;
    };
    LEGALCONTENT: {
        update: string;
        get: string;
    };
    Vehicle: {
        add: string;
        get: string;
        update: string;
        delete: string;
        approved: string;
        rejected: string;
    };
    EmergencyContact: {
        add: string;
        get: string;
        update: string;
        delete: string;
    };
    REFERFRIEND: {
        get: string;
        update: string;
    };
    NOTIFICATIONS: {
        get: string;
        update: string;
        delete: string;
    };
    CITY: {
        add: string;
        get: string;
        update: string;
        delete: string;
        available: string;
        comingSoon: string;
    };
    PRICES: {
        add: string;
        get: string;
        update: string;
        delete: string;
    };
    RATINGS: {
        add: string;
        get: string;
    };
    BUSINESS: {
        add: string;
        get: string;
        update: string;
        delete: string;
    };
    DRIVER: {
        dashborad: string;
        online: string;
        ConnectionStatus: string;
        checkPincode: string;
        searchDriver: string;
        orderAccepted: string;
        orderDecline: string;
        documents: string;
        cancelRides: string;
        addInstructions: string;
    };
    CONTACTUS: {
        add: string;
        get: string;
    };
    ADDRESS: {
        add: string;
        get: string;
        update: string;
        delete: string;
    };
    PINCODE: {
        add: string;
        get: string;
        update: string;
        delete: string;
    };
    DOCUMENTS: {
        add: string;
        get: string;
        update: string;
        delete: string;
    };
    CURRENCY: {
        add: string;
        get: string;
        update: string;
        delete: string;
    };
    RIDES: {
        add: string;
        get: string;
        updated: string;
        delete: string;
        instructions: string;
        distanceCount: string;
    };
    VEHICLETYPES: {
        add: string;
        get: string;
        update: string;
        delete: string;
    };
    LANGUAGES: {
        add: string;
        get: string;
        update: string;
        delete: string;
    };
    FAQs: {
        add: string;
        get: string;
        update: string;
        delete: string;
    };
    CAREERS: {
        add: string;
        get: string;
        update: string;
        delete: string;
    };
    CAREERAPPLICATIONS: {
        add: string;
        get: string;
        update: string;
        delete: string;
    };
    CATEGORY: {
        add: string;
        get: string;
        update: string;
        delete: string;
    };
    TESTIMONIALS: {
        add: string;
        get: string;
        update: string;
        delete: string;
    };
    BLOGS: {
        add: string;
        get: string;
        update: string;
        delete: string;
    };
    FEEDBACKS: {
        add: string;
        get: string;
        update: string;
        delete: string;
    };
    COUPONS: {
        add: string;
        get: string;
        update: string;
        delete: string;
        redeem: string;
    };
    WALLETS: {
        add: string;
        get: string;
        transfer: string;
        payment: string;
        removed: string;
        Addition: string;
    };
    PAYMENT: {
        earningsHistory: string;
        success: string;
        WeeklyStatement: string;
    };
    BANKACCOUNTS: {
        add: string;
        get: string;
        update: string;
        cashout: string;
        delete: string;
    };
    CASHOUT: {
        get: string;
        update: string;
    };
    ADDITIONAL_FEES: {
        add: string;
        get: string;
        update: string;
        delete: string;
    };
    REFERRAL: {
        add: string;
        get: string;
        update: string;
        delete: string;
        used: string;
    };
};
