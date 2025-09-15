var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import logger from './logger';
import GoogleConfig from '../config/google.config';
import * as Utils from './utils';
const apiKey = GoogleConfig.apiKey;
export function getLatLong(address) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`);
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
            logger.error('Error fetching geocode:', error);
            throw error;
        }
    });
}
export function calculateDistance(origin, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const originLocation = yield getLatLong(origin);
            const destinationLocation = yield getLatLong(destination);
            const response = yield axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLocation.lat},${originLocation.lng}&destinations=${destinationLocation.lat},${destinationLocation.lng}&key=${apiKey}`);
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
            logger.error('Error calculating distance:', error);
            throw error;
        }
    });
}
export function calculateDuration(originLocation, destinationLocation) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLocation.lat},${originLocation.lng}&destinations=${destinationLocation.lat},${destinationLocation.lng}&key=${apiKey}`;
            console.log('API Request URL:', url);
            const response = yield axios.get(url);
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
export function getCity(lat, lng) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
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
            logger.error('Error get city:', error);
            throw error;
        }
    });
}
export function getAllGooglePlace(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
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
//# sourceMappingURL=google.utils.js.map