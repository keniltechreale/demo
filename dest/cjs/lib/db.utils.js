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
exports.connect = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const logger_1 = __importDefault(require("./logger"));
const db_config_1 = __importDefault(require("../config/db.config"));
const dbConfig = db_config_1.default;
exports.sequelize = new sequelize_1.Sequelize(dbConfig.DATABASE, dbConfig.DATABASE_USER_NAME, dbConfig.DATABASE_PASSWORD, {
    host: dbConfig.DATABASE_HOST,
    dialect: 'mysql',
    // port: Number(config.DB_PORT), // 👈 Add this line
    database: db_config_1.default.DATABASE,
    pool: { max: 5, min: 0, idle: 1000 },
});
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.sequelize.authenticate();
        yield exports.sequelize.query(`CREATE DATABASE IF NOT EXISTS ${db_config_1.default.DATABASE}`, {
            type: sequelize_1.QueryTypes.RAW,
        });
        logger_1.default.info('Database piupiu created or already exists.');
        // sequelize.options.database = 'PiuPiu';
        yield exports.sequelize.authenticate();
        logger_1.default.info('Connection established to the "PiuPiu" database.');
    }
    catch (err) {
        logger_1.default.error(`Error in connection: ${err}`);
    }
});
exports.connect = connect;
//# sourceMappingURL=db.utils.js.map