/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import logger from './logger';
import CountryModel, { ICountryData } from '../models/countrydata.model';

export const statusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  REQUEST_ENTITY_LARGE: 413,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

type ErrorResponse = {
  status: string;
  message: string;
};

/**
 * Sends an error response.
 *
 * @param data - The data for the error response.
 * @returns The error response.
 */
export function sendErrorResponse(data: { message: string }): ErrorResponse {
  return {
    status: 'error',
    ...data,
  };
}

function parseError(err: Error): string {
  logger.error(err.stack);
  return err.message;
}

/**
 * Get the error message based on the given error.
 * @param err The error object or message.
 * @returns The error message.
 */
export function getErrorMsg(err: unknown): { message: string } {
  if (typeof err === 'string') {
    logger.error(err);
    return { message: err };
  } else {
    return { message: parseError(err as Error) };
  }
}

// export function getErrorStatusCode(err: string | Error) {
export function getErrorStatusCode(err: unknown) {
  if (typeof err === 'string') {
    logger.error(err);
    return statusCode.BAD_REQUEST;
  } else {
    return statusCode.INTERNAL_SERVER_ERROR;
  }
}

interface SuccessResponse {
  status: string;
  message?: string;
  data: unknown;
  // other properties of the data object
}

/**
 * Creates a success response object by merging the provided data with a 'success' status.
 *
 * @param {SuccessResponse} data - The data to be included in the success response.
 * @return {SuccessResponse} - The success response object.
 */
export function sendSuccessResponse({
  message,
  ...data
}: Record<string, unknown>): SuccessResponse {
  return {
    status: 'success',
    ...(message && { message: message as string }),
    data: data as Record<string, unknown>,
  };
}

/**
 * Throws an error and logs it using the logger. The error can be provided as an
 * instance of the Error class or as a string.
 *
 * @param {Error | string} err - The error to throw.
 * @return {void} This function does not return a value.
 */
export function throwError(err: Error | string): void {
  logger.error(err);
  throw err;
}

export function generateOTP(): string {
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

interface FilePathInfo {
  filepath: string;
  extension: string;
  name: string;
  filename: string;
}

export function extractFilePath(path: string): FilePathInfo {
  const url: string = path; // eg: path/to/dummy/files/dummy_filename.png
  const ind1: number = url.lastIndexOf('/');
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

export interface VerificationResult {
  status: 'approved' | 'rejected' | 'pending';
  rejectedKeys?: Record<string, string>;
}

export interface VerificationResult {
  status: 'approved' | 'rejected' | 'pending';
  rejectedKeys?: Record<string, string>;
}

type DocumentStatus = 'pending' | 'approved' | 'rejected';

interface Document {
  name: string;
  url: string[];
  status: DocumentStatus;
  reason?: string;
}

export function checkVerification(
  oldObject: Document[],
  documents: Document[],
): VerificationResult {
  const oldObjectMap: Record<string, Document> = {};
  const rejectedKeys: Record<string, string> = {};
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
  } else if (documents.every((doc) => doc.status === 'approved')) {
    return { status: 'approved' };
  } else {
    return { status: 'pending' };
  }
}
export function docVerification(
  arr: {
    name: string;
    url: string[];
    status: string;
    reason?: string;
  }[],
): VerificationResult {
  let hasRejected = false;
  const rejectedKeys: Record<string, string> = {};

  for (const doc of arr) {
    if (doc.status === 'rejected') {
      rejectedKeys[doc.name] = doc.reason || 'No reason provided';
      hasRejected = true;
    }
  }

  if (hasRejected) {
    return { status: 'rejected', rejectedKeys };
  } else if (arr.every((doc) => doc.status === 'approved')) {
    return { status: 'approved' };
  } else {
    return { status: 'pending' };
  }
}

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

export const updateCountrySymbols = async () => {
  const countries: ICountryData[] = await CountryModel.findAll({ raw: true });
  for (const country of countries) {
    let currencyCodes: string[];

    try {
      currencyCodes = JSON.parse(country.currencyCode);

      if (!Array.isArray(currencyCodes) || currencyCodes.length === 0) {
        continue;
      }
    } catch (error) {
      continue;
    }

    const currencyCode = currencyCodes[0];
    const symbol = currencySymbols[currencyCode as keyof typeof currencySymbols];
    console.log('----------------->', symbol);

    if (symbol) {
      await CountryModel.update({ symbol }, { where: { countryCode: country.countryCode } });
    }
  }
  return;
};
