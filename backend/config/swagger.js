const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hypertube API',
            version: '1.0.0',
            description: 'API documentation for Hypertube',
        },
        servers: [
            { url: 'http://localhost:3000/api' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: [path.join(__dirname, '../docs/*.js'),]
};

module.exports = swaggerJsdoc(options);