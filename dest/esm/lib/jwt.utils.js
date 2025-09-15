import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.config';
export function createToken(payload) {
    return new Promise((resolve, reject) => {
        try {
            const token = jwt.sign(payload, jwtConfig.secret, jwtConfig.signOptions);
            resolve(token);
        }
        catch (err) {
            reject(err);
        }
    });
}
export function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtConfig.secret, function (err, decoded) {
            if (err) {
                reject(err);
            }
            else {
                resolve(decoded);
            }
        });
    });
}
//# sourceMappingURL=jwt.utils.js.map