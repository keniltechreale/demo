declare const _default: {
    options: {
        swaggerDefinition: {
            openapi: string;
            info: {
                title: string;
                version: string;
                description: string;
                license: {
                    name: string;
                    url: string;
                };
            };
            servers: {
                url: string;
                description: string;
            }[];
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: string;
                        scheme: string;
                        bearerFormat: string;
                    };
                };
            };
        };
        apis: string[];
    };
};
export default _default;
