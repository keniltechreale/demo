"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
exports.default = {
    options: {
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: 'PiuPiu - APIs',
                version: '1.0.0',
                description: 'This is a REST API application made with Express ts',
                license: {
                    name: 'Licensed Under MIT',
                    url: 'https://spdx.org/licenses/MIT.html',
                },
            },
            servers: [
                {
                    url: `http://localhost:${config_1.default.PORT}`,
                    description: 'Development server',
                },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT', // Assuming JWT bearer tokens
                    },
                },
            },
        },
        // Paths to files containing OpenAPI definitions
        apis: ['./**/*.ts'],
    },
};
//# sourceMappingURL=swagger.config.js.map