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
exports.getAllGooglePlace = exports.getCity = exports.calculateDuration = exports.calculateDistance = exports.getLatLong = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("./logger"));
const google_config_1 = __importDefault(require("../config/google.config"));
const Utils = __importStar(require("./utils"));
const apiKey = google_config_1.default.apiKey;
function getLatLong(address) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`);
            if (response.data.status === 'OK') {
                const location = response.data.results[0].geometry.location;
                return { lat: location.lat, lng: location.lng };
            }
            else {
                if (response.data.status == 'ZERO_RESULTS') {
                    Utils.throwError(`Please enter valid address`);
                }
                Utils.throwError(`Geocoding API error : ${response.data.status}`);
            }
        }
        catch (error) {
            logger_1.default.error('Error fetching geocode:', error);
            throw error;
        }
    });
}
exports.getLatLong = getLatLong;
function calculateDistance(origin, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const originLocation = yield getLatLong(origin);
            const destinationLocation = yield getLatLong(destination);
            const response = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLocation.lat},${originLocation.lng}&destinations=${destinationLocation.lat},${destinationLocation.lng}&key=${apiKey}`);
            const distance = response.data.rows[0].elements[0].distance.value;
            const duration = response.data.rows[0].elements[0].duration.value;
            const distanceInkm = distance / 1000;
            const durationInmins = Math.round(duration / 60);
            return {
                distanceInkm,
                durationInmins,
                originLocation: originLocation,
                destinationLocation: destinationLocation,
            };
        }
        catch (error) {
            logger_1.default.error('Error calculating distance:', error);
            throw error;
        }
    });
}
exports.calculateDistance = calculateDistance;
function calculateDuration(originLocation, destinationLocation) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLocation.lat},${originLocation.lng}&destinations=${destinationLocation.lat},${destinationLocation.lng}&key=${apiKey}`;
            console.log('API Request URL:', url);
            const response = yield axios_1.default.get(url);
            console.log('Distance Matrix API Response:', JSON.stringify(response.data));
            const rows = response.data.rows;
            if (!rows || rows.length === 0 || !rows[0].elements || rows[0].elements.length === 0) {
                console.warn('Invalid Distance Matrix API response structure');
                return null;
            }
            const element = rows[0].elements[0];
            if (!element || element.status !== 'OK') {
                console.warn(`Element status not OK: ${(element === null || element === void 0 ? void 0 : element.status) || 'undefined'}`);
                return null;
            }
            const distance = (_a = element.distance) === null || _a === void 0 ? void 0 : _a.value;
            const duration = (_b = element.duration) === null || _b === void 0 ? void 0 : _b.value;
            if (!distance || !duration) {
                console.warn('Missing distance or duration data in API response');
                return null;
            }
            return {
                distanceInkm: distance / 1000,
                durationInmins: Math.round(duration / 60),
            };
        }
        catch (error) {
            console.error('Error during Distance Matrix API call:', error.message || error);
            return null;
        }
    });
}
exports.calculateDuration = calculateDuration;
function getCity(lat, lng) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
            if (response.data.results && response.data.results.length > 0) {
                const addressComponents = response.data.results[0].address_components;
                let city = '';
                for (const component of addressComponents) {
                    if (component.types.includes('locality')) {
                        city = component.long_name;
                        break;
                    }
                }
                return city;
            }
            else {
                console.log('No results found');
            }
        }
        catch (error) {
            logger_1.default.error('Error get city:', error);
            throw error;
        }
    });
}
exports.getCity = getCity;
function getAllGooglePlace(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
                params: {
                    location: args.location,
                    radius: args.radius,
                    type: args.type,
                    key: apiKey,
                },
            });
            console.log('places response', response.data);
            return response.data;
        }
        catch (error) {
            console.error('places response error', error);
            throw error;
        }
    });
}
exports.getAllGooglePlace = getAllGooglePlace;
//# sourceMappingURL=google.utils.js.map