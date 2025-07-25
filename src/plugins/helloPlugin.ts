import { FastifyPluginAsync } from 'fastify';

// Type for route parameters
type HelloParams = {
  name: string;
};

/**
 * Fastify plugin that provides a simple hello endpoint
 * Returns a greeting message for the provided name parameter
 */
const helloPlugin: FastifyPluginAsync = async fastify => {
  // Register the GET /hello/:name route
  fastify.get<{ Params: HelloParams }>(
    '/hello/:name',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 1,
            },
          },
          required: ['name'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              greeting: { type: 'string' },
            },
            required: ['greeting'],
          },
        },
      },
    },
    async request => {
      const { name } = request.params;

      // Return greeting response
      return {
        greeting: `Hi, ${name}!`,
      };
    }
  );
};

export default helloPlugin;
