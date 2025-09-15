var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Sequelize, QueryTypes } from 'sequelize';
import logger from './logger';
import config from '../config/db.config';
const dbConfig = config;
export const sequelize = new Sequelize(dbConfig.DATABASE, dbConfig.DATABASE_USER_NAME, dbConfig.DATABASE_PASSWORD, {
    host: dbConfig.DATABASE_HOST,
    dialect: 'mysql',
    // port: Number(config.DB_PORT), // 👈 Add this line
    database: config.DATABASE,
    pool: { max: 5, min: 0, idle: 1000 },
});
export const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        yield sequelize.query(`CREATE DATABASE IF NOT EXISTS ${config.DATABASE}`, {
            type: QueryTypes.RAW,
        });
        logger.info('Database piupiu created or already exists.');
        // sequelize.options.database = 'PiuPiu';
        yield sequelize.authenticate();
        logger.info('Connection established to the "PiuPiu" database.');
    }
    catch (err) {
        logger.error(`Error in connection: ${err}`);
    }
});
//# sourceMappingURL=db.utils.js.map