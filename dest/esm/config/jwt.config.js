import config from './config';
export default {
    secret: config.JWT_SECRET,
    signOptions: {
        expiresIn: '15d',
        algorithm: 'HS256',
    },
};
//# sourceMappingURL=jwt.config.js.map