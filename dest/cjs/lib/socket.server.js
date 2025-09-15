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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
const orderNamespaces = new Map();
function initializeSocket(io) {
    const driverNamespace = io.of('/drivers');
    const customerNamespace = io.of('/customers');
    driverNamespace.on('connection', (client) => {
        client.on('register', (userId) => {
            client.emit('connection status', 'registered', userId);
            logger_1.default.info(`[Socket] Driver connected: ${client.id}`);
        });
        client.on('disconnect', () => {
            logger_1.default.info(`[Socket] Driver disconnected: ${client.id}`);
        });
    });
    customerNamespace.on('connection', (client) => {
        client.on('register', (userId) => {
            client.emit('connection status', 'registered', userId);
            logger_1.default.info(`[Socket] Customer connected: ${client.id}`);
        });
        client.on('disconnect', () => {
            logger_1.default.info(`[Socket] Customer disconnected: ${client.id}`);
        });
    });
    io.on('connection', (client) => {
        client.on('rideIDregister', (orderId) => __awaiter(this, void 0, void 0, function* () {
            if (!orderNamespaces.has(orderId)) {
                const nsp = io.of(`/rides/${orderId}`);
                nsp.on('connection', (orderClient) => __awaiter(this, void 0, void 0, function* () {
                    yield orderClient.join(orderId);
                    orderClient.on('location update', (locationData) => {
                        nsp.to(orderId).emit('location update', locationData);
                    });
                }));
                orderNamespaces.set(orderId, nsp);
            }
            yield client.join(`/rides/${orderId}`);
            client.emit('connection status', 'registered', orderId);
        }));
        client.on('disconnect', () => {
            logger_1.default.info(`[Socket] Client disconnected: ${client.id}`);
        });
    });
    io.on('error', (error) => {
        logger_1.default.error(`Socket.io error: ${error}`);
    });
}
exports.default = initializeSocket;
//# sourceMappingURL=socket.server.js.map