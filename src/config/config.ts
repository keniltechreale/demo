import Joi, { ValidationResult } from 'joi';
import dotenv from 'dotenv';

interface IEnvVars {
  PORT: string;
  NODE_ENV: string;
  DEBUG: string;
  JWT_SECRET: string;
  DATABASE_HOST: string;
  // DB_PORT: string;
  DATABASE_USER_NAME: string;
  DATABASE_PASSWORD: string;
  DATABASE: string;
  AWS_ACCESS_KEY: string;
  AWS_SECRET_ACCESS: string;
  AWS_REGION: string;
  S3_BUCKET_NAME: string;
  // S3_ENDPOINT: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTHTOKEN: string;
  TWILIO_PHONENUMBER: string;
  GOOGLE_API_KEY: string;
  EMAIL_HOST: string;
  EMAIL_PORT: string;
  EMAIL_SECURE: string;
  EMAIL_SERVICE: string;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
  DRIVER_PROJECT_ID: string;
  DRIVER_CLIENT_EMAIL: string;
  DRIVER_PRIVATE_KEY: string;
  CUSTOMER_PROJECT_ID: string;
  CUSTOMER_CLIENT_EMAIL: string;
  CUSTOMER_PRIVATE_KEY: string;
  PROXYPAY_API_KEY: string;
  PROXYPAY_SANDBOX: string;
  PROXYPAY_BASE_URL_SANDBOX: string;
  PROXYPAY_BASE_URL_PRODUCTION: string;
}
// Load environment variables from .env file
dotenv.config();

// Define schema for environment variables with clear types
const schema: Joi.ObjectSchema<IEnvVars> = Joi.object<IEnvVars, true, IEnvVars>({
  PORT: Joi.string().required().description('Port is required'),
  NODE_ENV: Joi.string().required().description('NODE_ENV is required'),
  DEBUG: Joi.string().required().description('DEBUG is required'),
  JWT_SECRET: Joi.string().required().description('JWT_SECRET is required'),
  DATABASE_HOST: Joi.string().required().description('DATABASE_HOST is required'),
  // DB_PORT: Joi.string().required().description('DB_PORT is required'),
  DATABASE_USER_NAME: Joi.string().required().description('DATABASE_USER_NAME is required'),
  DATABASE_PASSWORD: Joi.string().required().description('DATABASE_PASSWORD is required'),
  DATABASE: Joi.string().required().description('DATABASE is required'),
  AWS_ACCESS_KEY: Joi.string().required().description('AWS_ACCESS_KEY is required'),
  AWS_SECRET_ACCESS: Joi.string().required().description('AWS_SECRET_ACCESS is required'),
  AWS_REGION: Joi.string().required().description('AWS_REGION is required'),
  S3_BUCKET_NAME: Joi.string().required().description('S3_BUCKET_NAME is required'),
  // S3_ENDPOINT: Joi.string().required().description('S3_ENDPOINT is required'),
  TWILIO_ACCOUNT_SID: Joi.string().required().description('TWILIO_ACCOUNT_SID is required'),
  TWILIO_AUTHTOKEN: Joi.string().required().description('TWILIO_AUTHTOKEN is required'),
  TWILIO_PHONENUMBER: Joi.string().required().description('TWILIO_PHONENUMBER is required'),
  GOOGLE_API_KEY: Joi.string().required().description('GOOGLE_API_KEY is required'),
  EMAIL_HOST: Joi.string().required().description('EMAIL_HOST is required'),
  EMAIL_PORT: Joi.string().required().description('EMAIL_PORT is required'),
  EMAIL_SECURE: Joi.string().required().description('EMAIL_SECURE is required'),
  EMAIL_SERVICE: Joi.string().required().description('EMAIL_SERVICE is required'),
  EMAIL_USER: Joi.string().required().description('EMAIL_USER is required'),
  EMAIL_PASSWORD: Joi.string().required().description('EMAIL_PASSWORD is required'),
  DRIVER_PROJECT_ID: Joi.string().required().description('DRIVER_PROJECT_ID is required'),
  DRIVER_CLIENT_EMAIL: Joi.string().required().description('DRIVER_CLIENT_EMAIL is required'),
  DRIVER_PRIVATE_KEY: Joi.string().required().description('DRIVER_PRIVATE_KEY is required'),
  CUSTOMER_PROJECT_ID: Joi.string().required().description('CUSTOMER_PROJECT_ID is required'),
  CUSTOMER_CLIENT_EMAIL: Joi.string().required().description('CUSTOMER_CLIENT_EMAIL is required'),
  CUSTOMER_PRIVATE_KEY: Joi.string().required().description('CUSTOMER_PRIVATE_KEY is required'),
  PROXYPAY_API_KEY: Joi.string().required().description('PROXYPAY_API_KEY is required'),
  PROXYPAY_SANDBOX: Joi.string().required().description('PROXYPAY_SANDBOX is required'),
  PROXYPAY_BASE_URL_SANDBOX: Joi.string()
    .required()
    .description('PROXYPAY_BASE_URL_SANDBOX is required'),
  PROXYPAY_BASE_URL_PRODUCTION: Joi.string()
    .required()
    .description('PROXYPAY_BASE_URL_PRODUCTION is required'),
})
  .unknown()
  .required();

// Validate environment variables with type safety
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { error, value }: ValidationResult<IEnvVars> = schema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: IEnvVars = value as IEnvVars;

const config: IEnvVars = {
  PORT: envVars.PORT,
  NODE_ENV: envVars.NODE_ENV,
  DEBUG: envVars.DEBUG,
  JWT_SECRET: envVars.JWT_SECRET,
  DATABASE_HOST: envVars.DATABASE_HOST,
  // DB_PORT: envVars.DB_PORT,
  DATABASE_USER_NAME: envVars.DATABASE_USER_NAME,
  DATABASE_PASSWORD: envVars.DATABASE_PASSWORD,
  DATABASE: envVars.DATABASE,
  AWS_ACCESS_KEY: envVars.AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS: envVars.AWS_SECRET_ACCESS,
  AWS_REGION: envVars.AWS_REGION,
  S3_BUCKET_NAME: envVars.S3_BUCKET_NAME,
  // S3_ENDPOINT: envVars.S3_ENDPOINT,
  TWILIO_ACCOUNT_SID: envVars.TWILIO_ACCOUNT_SID,
  TWILIO_AUTHTOKEN: envVars.TWILIO_AUTHTOKEN,
  TWILIO_PHONENUMBER: envVars.TWILIO_PHONENUMBER,
  GOOGLE_API_KEY: envVars.GOOGLE_API_KEY,
  EMAIL_HOST: envVars.EMAIL_HOST,
  EMAIL_PORT: envVars.EMAIL_PORT,
  EMAIL_SECURE: envVars.EMAIL_SECURE,
  EMAIL_SERVICE: envVars.EMAIL_SERVICE,
  EMAIL_USER: envVars.EMAIL_USER,
  EMAIL_PASSWORD: envVars.EMAIL_PASSWORD,
  DRIVER_PROJECT_ID: envVars.DRIVER_PROJECT_ID,
  DRIVER_CLIENT_EMAIL: envVars.DRIVER_CLIENT_EMAIL,
  DRIVER_PRIVATE_KEY: envVars.DRIVER_PRIVATE_KEY,
  CUSTOMER_PROJECT_ID: envVars.CUSTOMER_PROJECT_ID,
  CUSTOMER_CLIENT_EMAIL: envVars.CUSTOMER_CLIENT_EMAIL,
  CUSTOMER_PRIVATE_KEY: envVars.CUSTOMER_PRIVATE_KEY,
  PROXYPAY_API_KEY: envVars.PROXYPAY_API_KEY,
  PROXYPAY_SANDBOX: envVars.PROXYPAY_SANDBOX,
  PROXYPAY_BASE_URL_SANDBOX: envVars.PROXYPAY_BASE_URL_SANDBOX,
  PROXYPAY_BASE_URL_PRODUCTION: envVars.PROXYPAY_BASE_URL_PRODUCTION,
};

export default config;
