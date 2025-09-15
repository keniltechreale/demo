import { Sequelize, QueryTypes } from 'sequelize';
import logger from './logger';
import config from '../config/db.config';

interface DbConfig {
  DATABASE: string;
  DATABASE_USER_NAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_HOST: string;
}
const dbConfig: DbConfig = config;

export const sequelize: Sequelize = new Sequelize(
  dbConfig.DATABASE,
  dbConfig.DATABASE_USER_NAME,
  dbConfig.DATABASE_PASSWORD,
  {
    host: dbConfig.DATABASE_HOST,
    dialect: 'mysql',
    // port: Number(config.DB_PORT), // 👈 Add this line
    database: config.DATABASE,
    pool: { max: 5, min: 0, idle: 1000 },
  },
);

export const connect = async (): Promise<void> => {
  try {
    await sequelize.authenticate();

    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${config.DATABASE}`, {
      type: QueryTypes.RAW,
    });

    logger.info('Database piupiu created or already exists.');

    // sequelize.options.database = 'PiuPiu';

    await sequelize.authenticate();

    logger.info('Connection established to the "PiuPiu" database.');
  } catch (err) {
    logger.error(`Error in connection: ${err}`);
  }
};
