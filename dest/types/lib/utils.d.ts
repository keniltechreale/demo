export declare const statusCode: {
    OK: number;
    CREATED: number;
    BAD_REQUEST: number;
    UNAUTHORIZED: number;
    FORBIDDEN: number;
    REQUEST_ENTITY_LARGE: number;
    UNPROCESSABLE_ENTITY: number;
    INTERNAL_SERVER_ERROR: number;
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
export declare function sendErrorResponse(data: {
    message: string;
}): ErrorResponse;
/**
 * Get the error message based on the given error.
 * @param err The error object or message.
 * @returns The error message.
 */
export declare function getErrorMsg(err: unknown): {
    message: string;
};
export declare function getErrorStatusCode(err: unknown): number;
interface SuccessResponse {
    status: string;
    message?: string;
    data: unknown;
}
/**
 * Creates a success response object by merging the provided data with a 'success' status.
 *
 * @param {SuccessResponse} data - The data to be included in the success response.
 * @return {SuccessResponse} - The success response object.
 */
export declare function sendSuccessResponse({ message, ...data }: Record<string, unknown>): SuccessResponse;
/**
 * Throws an error and logs it using the logger. The error can be provided as an
 * instance of the Error class or as a string.
 *
 * @param {Error | string} err - The error to throw.
 * @return {void} This function does not return a value.
 */
export declare function throwError(err: Error | string): void;
export declare function generateOTP(): string;
interface FilePathInfo {
    filepath: string;
    extension: string;
    name: string;
    filename: string;
}
export declare function extractFilePath(path: string): FilePathInfo;
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
export declare function checkVerification(oldObject: Document[], documents: Document[]): VerificationResult;
export declare function docVerification(arr: {
    name: string;
    url: string[];
    status: string;
    reason?: string;
}[]): VerificationResult;
export declare const updateCountrySymbols: () => Promise<void>;
export {};
