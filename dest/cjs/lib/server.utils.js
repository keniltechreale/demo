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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_config_1 = __importDefault(require("../config/swagger.config"));
const routes_1 = __importDefault(require("../routes"));
const Utils = __importStar(require("./utils"));
// Import Utility
const logger_1 = __importStar(require("./logger"));
const multer_1 = require("multer");
function createServer() {
    return new Promise((resolve, reject) => {
        try {
            const app = (0, express_1.default)();
            // enable CORS - Cross Origin Resource Sharing
            app.use((0, cors_1.default)({ credentials: true, origin: '*' }));
            app.use(logger_1.morganMiddleware);
            app.use(body_parser_1.default.urlencoded({ extended: false }));
            app.use(body_parser_1.default.json());
            app.use('/api/v1', routes_1.default);
            app.use((err, req, res, next) => {
                if (err instanceof multer_1.MulterError) {
                    res
                        .status(Utils.statusCode.BAD_REQUEST)
                        .json({ status: 'error', error: 'File upload failed', message: err.message });
                }
                else {
                    next(err);
                }
            });
            app.use((err, req, res, next) => {
                if (err instanceof SyntaxError && err.status === 413 && 'body' in err) {
                    res
                        .status(Utils.statusCode.REQUEST_ENTITY_LARGE)
                        .send({ status: 'error', message: 'Request entity too large' });
                }
                else {
                    next(err);
                }
            });
            app.get('/', (req, res) => {
                res.send({ message: 'Welcome to PiuPiu' });
            });
            const swaggerSpec = (0, swagger_jsdoc_1.default)(swagger_config_1.default.options);
            app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, { explorer: true }));
            // cron.schedule('* * * * *', () => {
            //   (async () => {
            //     try {
            //       await sendScheduleRideNotification();
            //     } catch (error) {
            //       logger.error('Error in scheduled task:', error);
            //     }
            //   })().catch((error) => {
            //     logger.error('Unexpected error in scheduled task:', error);
            //   });
            // });
            // cron.schedule('0 0 * * 1', () => {
            //   (async () => {
            //     try {
            //       await sendWeeklyStatement();
            //     } catch (error) {
            //       logger.error('Error in scheduled task:', error);
            //     }
            //   })().catch((error) => {
            //     logger.error('Unexpected error in scheduled task:', error);
            //   });
            // });
            resolve(app);
        }
        catch (err) {
            logger_1.default.error(err);
            reject(err);
        }
    });
}
exports.createServer = createServer;
//# sourceMappingURL=server.utils.js.map