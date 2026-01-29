
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export function setupSwagger(app){
  const options = {
    definition: {
      openapi: '3.0.3',
      info: {
        title: 'E‑commerce API',
        version: '1.0.0',
        description: 'Node.js 24 + Cosmos DB (Mongo API) — Users, Products, Carts, Orders'
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Local dev' }
      ],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
        },
        schemas: {
          AuthResponse: {
            type: 'object',
            properties: { token: { type: 'string' }, user: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, email: { type: 'string' } } } }
          },
          Product: {
            type: 'object',
            properties: {
              _id: { type: 'string' }, name: { type: 'string' }, sku: { type: 'string' }, price: { type: 'number' },
              category: { type: 'string' }, description: { type: 'string' }, imageUrl: { type: 'string' }, stock: { type: 'integer' }
            }
          },
          CartItem: {
            type: 'object',
            properties: { productId: { type: 'string' }, name: { type: 'string' }, price: { type: 'number' }, qty: { type: 'integer' } }
          },
          Cart: {
            type: 'object',
            properties: { userId: { type: 'string' }, items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } } }
          },
          Order: {
            type: 'object',
            properties: { _id: { type: 'string' }, userId: { type: 'string' }, items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } }, total: { type: 'number' }, status: { type: 'string' }, createdAt: { type: 'string', format: 'date-time' } }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.js']
  };
  const spec = swaggerJSDoc(options);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
}
