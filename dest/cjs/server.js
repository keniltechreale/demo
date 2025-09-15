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
exports.io = void 0;
const logger_1 = __importDefault(require("./lib/logger"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const config_1 = __importDefault(require("./config/config"));
const ServerUtils = __importStar(require("./lib/server.utils"));
const DBUtils = __importStar(require("./lib/db.utils"));
const app_utils_1 = __importDefault(require("./lib/app.utils"));
const socket_server_1 = __importDefault(require("./lib/socket.server"));
let io;
void (() => __awaiter(void 0, void 0, void 0, function* () {
    // Connect Database
    yield DBUtils.connect();
    yield app_utils_1.default.init();
    // Setup App
    // Connect Server
    ServerUtils.createServer()
        .then((app) => {
        // Start the server
        const PORT = config_1.default.PORT;
        const httpServer = (0, http_1.createServer)(app);
        exports.io = io = new socket_io_1.Server(httpServer, { cors: { origin: '*' }, path: '/findDrivers/' });
        (0, socket_server_1.default)(io);
        httpServer.listen(PORT);
        // app.listen(PORT);
        logger_1.default.info(`Server is running on port ${PORT}`);
        // await connection();
    })
        .catch((err) => {
        logger_1.default.error(err);
    });
}))();
//# sourceMappingURL=server.js.map