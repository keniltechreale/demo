import config from './config';

export default {
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
          url: `http://localhost:${config.PORT}`,
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
