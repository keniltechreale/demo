export declare function getLatLong(address: string): Promise<{
    lat: number;
    lng: number;
}>;
export declare function calculateDistance(origin: string, destination: string): Promise<{
    distanceInkm: number;
    durationInmins: number;
    originLocation: {
        lat: number;
        lng: number;
    };
    destinationLocation: {
        lat: number;
        lng: number;
    };
}>;
export declare function calculateDuration(originLocation: {
    lat: number;
    lng: number;
}, destinationLocation: {
    lat: number;
    lng: number;
}): Promise<{
    distanceInkm: number;
    durationInmins: number;
} | null>;
export declare function getCity(lat: number, lng: number): Promise<string>;
export interface GooglePlaceArgs {
    location: string;
    radius: number;
    type?: string;
}
export declare function getAllGooglePlace(args: GooglePlaceArgs): Promise<any>;
