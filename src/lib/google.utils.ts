import axios, { AxiosResponse } from 'axios';
import logger from './logger';
import GoogleConfig from '../config/google.config';
import * as Utils from './utils';

const apiKey: string = GoogleConfig.apiKey;

interface DistanceMatrixResponse {
  rows: {
    elements: {
      distance: {
        text: string;
        value: number;
      };
      duration: {
        text: string;
        value: number;
      };
      status: string;
    }[];
  }[];
}

interface GeocodeResponse {
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
  status: string;
}

export async function getLatLong(address: string): Promise<{ lat: number; lng: number }> {
  try {
    const response: AxiosResponse<GeocodeResponse> = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`,
    );
    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      if (response.data.status == 'ZERO_RESULTS') {
        Utils.throwError(`Please enter valid address`);
      }
      Utils.throwError(`Geocoding API error : ${response.data.status}`);
    }
  } catch (error) {
    logger.error('Error fetching geocode:', error);
    throw error;
  }
}

export async function calculateDistance(
  origin: string,
  destination: string,
): Promise<{
  distanceInkm: number;
  durationInmins: number;
  originLocation: { lat: number; lng: number };
  destinationLocation: { lat: number; lng: number };
}> {
  try {
    const originLocation = await getLatLong(origin);
    const destinationLocation = await getLatLong(destination);

    const response: AxiosResponse<DistanceMatrixResponse> = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLocation.lat},${originLocation.lng}&destinations=${destinationLocation.lat},${destinationLocation.lng}&key=${apiKey}`,
    );

    const distance: number = response.data.rows[0].elements[0].distance.value;
    const duration: number = response.data.rows[0].elements[0].duration.value;

    const distanceInkm: number = distance / 1000;
    const durationInmins: number = Math.round(duration / 60);

    return {
      distanceInkm,
      durationInmins,
      originLocation: originLocation,
      destinationLocation: destinationLocation,
    };
  } catch (error) {
    logger.error('Error calculating distance:', error);
    throw error;
  }
}

export async function calculateDuration(
  originLocation: { lat: number; lng: number },
  destinationLocation: { lat: number; lng: number },
): Promise<{
  distanceInkm: number;
  durationInmins: number;
} | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLocation.lat},${originLocation.lng}&destinations=${destinationLocation.lat},${destinationLocation.lng}&key=${apiKey}`;
    console.log('API Request URL:', url);

    const response: AxiosResponse<DistanceMatrixResponse> = await axios.get(url);
    console.log('Distance Matrix API Response:', JSON.stringify(response.data));

    const rows = response.data.rows;
    if (!rows || rows.length === 0 || !rows[0].elements || rows[0].elements.length === 0) {
      console.warn('Invalid Distance Matrix API response structure');
      return null;
    }

    const element = rows[0].elements[0];
    if (!element || element.status !== 'OK') {
      console.warn(`Element status not OK: ${element?.status || 'undefined'}`);
      return null;
    }

    const distance = element.distance?.value;
    const duration = element.duration?.value;

    if (!distance || !duration) {
      console.warn('Missing distance or duration data in API response');
      return null;
    }

    return {
      distanceInkm: distance / 1000,
      durationInmins: Math.round(duration / 60),
    };
  } catch (error) {
    console.error('Error during Distance Matrix API call:', error.message || error);
    return null;
  }
}

export async function getCity(lat: number, lng: number) {
  try {
    const response: AxiosResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
    );
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
    } else {
      console.log('No results found');
    }
  } catch (error) {
    logger.error('Error get city:', error);
    throw error;
  }
}

export interface GooglePlaceArgs {
  location: string; // or [number, number] for latitude and longitude
  radius: number;
  type?: string; // type is optional if not always required
}

export async function getAllGooglePlace(args: GooglePlaceArgs) {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: args.location,
          radius: args.radius,
          type: args.type,
          key: apiKey,
        },
      },
    );

    console.log('places response', response.data);
    return response.data;
  } catch (error) {
    console.error('places response error', error);
    throw error;
  }
}
