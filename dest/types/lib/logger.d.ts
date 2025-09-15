/// <reference types="node" />
import winston from 'winston';
declare const logger: winston.Logger;
export default logger;
export declare const morganMiddleware: (req: import("http").IncomingMessage, res: import("http").ServerResponse<import("http").IncomingMessage>, callback: (err?: Error) => void) => void;
