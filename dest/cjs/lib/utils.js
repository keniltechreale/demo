"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCountrySymbols = exports.docVerification = exports.checkVerification = exports.extractFilePath = exports.generateOTP = exports.throwError = exports.sendSuccessResponse = exports.getErrorStatusCode = exports.getErrorMsg = exports.sendErrorResponse = exports.statusCode = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const logger_1 = __importDefault(require("./logger"));
const countrydata_model_1 = __importDefault(require("../models/countrydata.model"));
exports.statusCode = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    REQUEST_ENTITY_LARGE: 413,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
};
/**
 * Sends an error response.
 *
 * @param data - The data for the error response.
 * @returns The error response.
 */
function sendErrorResponse(data) {
    return Object.assign({ status: 'error' }, data);
}
exports.sendErrorResponse = sendErrorResponse;
function parseError(err) {
    logger_1.default.error(err.stack);
    return err.message;
}
/**
 * Get the error message based on the given error.
 * @param err The error object or message.
 * @returns The error message.
 */
function getErrorMsg(err) {
    if (typeof err === 'string') {
        logger_1.default.error(err);
        return { message: err };
    }
    else {
        return { message: parseError(err) };
    }
}
exports.getErrorMsg = getErrorMsg;
// export function getErrorStatusCode(err: string | Error) {
function getErrorStatusCode(err) {
    if (typeof err === 'string') {
        logger_1.default.error(err);
        return exports.statusCode.BAD_REQUEST;
    }
    else {
        return exports.statusCode.INTERNAL_SERVER_ERROR;
    }
}
exports.getErrorStatusCode = getErrorStatusCode;
/**
 * Creates a success response object by merging the provided data with a 'success' status.
 *
 * @param {SuccessResponse} data - The data to be included in the success response.
 * @return {SuccessResponse} - The success response object.
 */
function sendSuccessResponse(_a) {
    var { message } = _a, data = __rest(_a, ["message"]);
    return Object.assign(Object.assign({ status: 'success' }, (message && { message: message })), { data: data });
}
exports.sendSuccessResponse = sendSuccessResponse;
/**
 * Throws an error and logs it using the logger. The error can be provided as an
 * instance of the Error class or as a string.
 *
 * @param {Error | string} err - The error to throw.
 * @return {void} This function does not return a value.
 */
function throwError(err) {
    logger_1.default.error(err);
    throw err;
}
exports.throwError = throwError;
function generateOTP() {
    // const digits = '0123456789';
    // let otp = '';
    // Generate a random 4-digit OTP
    // for (let i = 0; i < 4; i++) {
    //   const randomIndex = Math.floor(Math.random() * digits.length);
    //   otp += digits[randomIndex];
    // }
    // return otp.toString();
    const otp = '1234';
    return otp;
}
exports.generateOTP = generateOTP;
function extractFilePath(path) {
    const url = path; // eg: path/to/dummy/files/dummy_filename.png
    const ind1 = url.lastIndexOf('/');
    return {
        filepath: url.substring(0, ind1 + 1), // path/to/dummy/files/
        extension: url.substring(url.lastIndexOf('.') + 1, url.length), // .png
        name: url
            .substring(url.lastIndexOf('/') + 1, url.length)
            .split('.')
            .slice(0, -1)
            .join('.'),
        filename: url.substring(url.lastIndexOf('/') + 1, url.length), // dummy_filename.png
    };
}
exports.extractFilePath = extractFilePath;
function checkVerification(oldObject, documents) {
    const oldObjectMap = {};
    const rejectedKeys = {};
    let hasRejected = false;
    for (const doc of oldObject) {
        oldObjectMap[doc.name] = doc;
    }
    for (const doc of documents) {
        const name = doc.name;
        const oldDoc = oldObjectMap[name];
        if (oldDoc && doc.status === 'rejected' && oldDoc.status !== 'rejected') {
            rejectedKeys[name] = doc.reason || 'No reason provided';
            hasRejected = true;
        }
    }
    if (hasRejected) {
        return { status: 'rejected', rejectedKeys };
    }
    else if (documents.every((doc) => doc.status === 'approved')) {
        return { status: 'approved' };
    }
    else {
        return { status: 'pending' };
    }
}
exports.checkVerification = checkVerification;
function docVerification(arr) {
    let hasRejected = false;
    const rejectedKeys = {};
    for (const doc of arr) {
        if (doc.status === 'rejected') {
            rejectedKeys[doc.name] = doc.reason || 'No reason provided';
            hasRejected = true;
        }
    }
    if (hasRejected) {
        return { status: 'rejected', rejectedKeys };
    }
    else if (arr.every((doc) => doc.status === 'approved')) {
        return { status: 'approved' };
    }
    else {
        return { status: 'pending' };
    }
}
exports.docVerification = docVerification;
const currencySymbols = {
    AFN: '؋',
    ALL: 'L',
    AMD: '֏',
    ANG: 'ƒ',
    AOA: 'Kz',
    ARS: '$',
    AUD: '$',
    AWG: 'ƒ',
    AZN: '₼',
    BAM: 'KM',
    BBD: '$',
    BDT: '৳',
    BGN: 'лв',
    BHD: '.د.ب',
    BIF: 'Fr',
    BMD: '$',
    BND: '$',
    BOB: '$b',
    BRL: 'R$',
    BSD: '$',
    BTN: 'Nu.',
    BWP: 'P',
    BYN: 'Br',
    BZD: '$',
    CAD: '$',
    CDF: 'Fr',
    CHF: 'Fr',
    CLP: '$',
    CNY: '¥',
    COP: '$',
    CRC: '₡',
    CUP: '$',
    CVE: '$',
    CZK: 'Kč',
    DJF: 'Fdj',
    DKK: 'kr.',
    DOP: '$',
    DZD: 'د.ج',
    EGP: '£',
    ERN: 'Nfa',
    ETB: 'Br',
    EUR: '€',
    FJD: '$',
    FKP: '£',
    FOK: 'kr',
    GBP: '£',
    GEL: '₾',
    GHS: '₵',
    GIP: '£',
    GMD: 'D',
    GNF: 'Fr',
    GTQ: 'Q',
    GYD: '$',
    HKD: 'HK$',
    HNL: 'L',
    HRK: 'kn',
    HTG: 'G',
    HUF: 'Ft',
    IDR: 'Rp',
    ILS: '₪',
    IMP: '£',
    INR: '₹',
    IQD: 'ع.د',
    IRR: '﷼',
    ISK: 'kr',
    JMD: '$',
    JOD: 'د.ا',
    JPY: '¥',
    KES: 'KSh',
    KGS: 'сом',
    KHR: '៛',
    KID: '$',
    KMF: 'Fr',
    KRW: '₩',
    KWD: 'د.ك',
    KYD: '$',
    KZT: '₸',
    LAK: '₭',
    LBP: 'ل.ل',
    LKR: 'Rs',
    LRD: '$',
    LSL: 'L',
    LYD: 'ل.د',
    MAD: 'د.م.',
    MDL: 'L',
    MGA: 'Ar',
    MKD: 'ден',
    MMK: 'K',
    MNT: '₮',
    MOP: 'MOP$',
    MRU: 'UM',
    MUR: '₨',
    MVR: 'MVR',
    MWK: 'MK',
    MXN: '$',
    MYR: 'RM',
    MZN: 'MT',
    NAD: '$',
    NGN: '₦',
    NIO: 'C$',
    NOK: 'kr',
    NPR: 'Rs',
    NZD: '$',
    OMR: 'ر.ع.',
    PAB: 'B/.',
    PEN: 'S/.',
    PGK: 'K',
    PHP: '₱',
    PKR: 'Rs',
    PLN: 'zł',
    PYG: '₲',
    QAR: 'ر.ق',
    RON: 'L',
    RSD: 'РСД',
    RUB: '₽',
    RWF: 'Fr',
    SAR: 'ر.س',
    SBD: '$',
    SCR: '₨',
    SDG: 'ج.س.',
    SEK: 'kr',
    SGD: '$',
    SHP: '£',
    SLL: 'Le',
    SOS: 'S',
    SRD: '$',
    SSP: '£',
    STN: 'Db',
    SYP: 'ل.س',
    SZL: 'E',
    THB: '฿',
    TJS: 'ЅМ',
    TMT: 'm',
    TND: 'د.ت',
    TOP: 'T$',
    TRY: '₺',
    TTD: '$',
    TWD: 'NT$',
    TZS: 'TSh',
    UAH: '₴',
    UGX: 'USh',
    USD: '$',
    UYU: '$',
    UZS: 'лв',
    VES: 'Bs.S',
    VND: '₫',
    VUV: 'VT',
    WST: 'T',
    XAF: 'Fr',
    XAG: 'XAG',
    XAU: 'XAU',
    XCD: '$',
    XDR: 'SDR',
    XOF: 'Fr',
    XPF: 'Fr',
    YER: 'ر.ي',
    ZAR: 'R',
};
const updateCountrySymbols = () => __awaiter(void 0, void 0, void 0, function* () {
    const countries = yield countrydata_model_1.default.findAll({ raw: true });
    for (const country of countries) {
        let currencyCodes;
        try {
            currencyCodes = JSON.parse(country.currencyCode);
            if (!Array.isArray(currencyCodes) || currencyCodes.length === 0) {
                continue;
            }
        }
        catch (error) {
            continue;
        }
        const currencyCode = currencyCodes[0];
        const symbol = currencySymbols[currencyCode];
        console.log('----------------->', symbol);
        if (symbol) {
            yield countrydata_model_1.default.update({ symbol }, { where: { countryCode: country.countryCode } });
        }
    }
    return;
});
exports.updateCountrySymbols = updateCountrySymbols;
//# sourceMappingURL=utils.js.map