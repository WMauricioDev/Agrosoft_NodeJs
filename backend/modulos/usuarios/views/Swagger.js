import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Agrosis API", 
            version: "1.0.0",
            description: "API para la gestión de cultivos, plagas, residuos y más en Agrosis.",
            contact: {
                name: "Grupo 3",
            },
            license: {
                name: "MIT",
                url: "https://opensource.org/licenses/MIT"
            }
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor de desarrollo local",
            },
            {
                url: "https://api.agrosis.com",
                description: "Servidor de producción",
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Autenticación con JWT. Formato: Bearer <token>"
                }
            }
        },
        security: [
            {
                BearerAuth: []
            }
        ]
    },
    apis: ["./modulos/**/routers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
