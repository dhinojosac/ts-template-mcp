import { FastifyPluginAsync } from 'fastify';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  WeatherForecastSchema,
  WeatherAlertsSchema,
  validateToolArgs,
  type WeatherForecastArgs,
  type WeatherAlertsArgs,
} from '../schemas/toolSchemas.js';

/**
 * Weather plugin demonstrating Zod validation for larger MCP projects
 * Shows how to organize tools by domain/plugin
 */
export function registerWeatherTools(server: McpServer) {
  // Weather forecast tool with Zod validation
  server.registerTool(
    'getWeatherForecast',
    {
      title: 'Get Weather Forecast',
      description:
        'Get weather forecast for a specific location using coordinates',
    },
    async (args: { [x: string]: any }) => {
      const { latitude, longitude }: WeatherForecastArgs = validateToolArgs(
        WeatherForecastSchema,
        args
      );

      // Simulate weather API call (replace with actual API)
      const forecast = await simulateWeatherAPI(latitude, longitude);

      return {
        content: [
          {
            type: 'text',
            text: `Weather forecast for coordinates (${latitude}, ${longitude}):\n${forecast}`,
          },
        ],
      };
    }
  );

  // Weather alerts tool with Zod validation
  server.registerTool(
    'getWeatherAlerts',
    {
      title: 'Get Weather Alerts',
      description: 'Get active weather alerts for a US state',
    },
    async (args: { [x: string]: any }) => {
      const { state }: WeatherAlertsArgs = validateToolArgs(
        WeatherAlertsSchema,
        args
      );

      // Simulate alerts API call (replace with actual API)
      const alerts = await simulateAlertsAPI();

      return {
        content: [
          {
            type: 'text',
            text: `Weather alerts for ${state}:\n${alerts}`,
          },
        ],
      };
    }
  );
}

/**
 * Simulate weather API call
 * In a real implementation, this would call an actual weather service
 */
async function simulateWeatherAPI(
  latitude: number,
  longitude: number
): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Generate mock forecast based on coordinates
  const temperature = Math.round(
    20 + latitude * 0.5 + (Math.random() * 10 - 5)
  );
  const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];

  return `
🌤️  Current Conditions: ${condition}
🌡️  Temperature: ${temperature}°C
        Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}
⏰ Updated: ${new Date().toLocaleString()}
  `.trim();
}

/**
 * Simulate weather alerts API call
 * In a real implementation, this would call an actual alerts service
 */
async function simulateAlertsAPI(): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Generate mock alerts based on state
  const alerts = [
    'Severe Thunderstorm Warning',
    'Flash Flood Watch',
    'Heat Advisory',
    'Winter Weather Advisory',
  ];

  const hasAlerts = Math.random() > 0.5;

  if (!hasAlerts) {
    return '✅ No active weather alerts for this state.';
  }

  const activeAlerts = alerts.filter(() => Math.random() > 0.7).slice(0, 2);

  if (activeAlerts.length === 0) {
    return '✅ No active weather alerts for this state.';
  }

  return activeAlerts.map(alert => `⚠️  ${alert}`).join('\n');
}

/**
 * Fastify plugin for weather-related REST endpoints
 * Demonstrates how to expose weather data via traditional REST API
 */
const weatherPlugin: FastifyPluginAsync = async fastify => {
  // GET /weather/forecast?lat=40.7128&lng=-74.0060
  fastify.get(
    '/weather/forecast',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            lat: { type: 'number', minimum: -90, maximum: 90 },
            lng: { type: 'number', minimum: -180, maximum: 180 },
          },
          required: ['lat', 'lng'],
        },
      },
    },
    async (request, reply) => {
      const { lat, lng } = request.query as { lat: number; lng: number };

      try {
        // Use the same validation as the MCP tool
        const args = { latitude: lat, longitude: lng };
        const { latitude, longitude }: WeatherForecastArgs = validateToolArgs(
          WeatherForecastSchema,
          args
        );

        const forecast = await simulateWeatherAPI(latitude, longitude);

        return {
          forecast,
          coordinates: { latitude, longitude },
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        return reply.status(400).send({
          error: 'Invalid coordinates',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  // GET /weather/alerts/:state
  fastify.get<{ Params: { state: string } }>(
    '/weather/alerts/:state',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              pattern: '^[A-Z]{2}$',
              description: 'Two-letter US state code',
            },
          },
          required: ['state'],
        },
      },
    },
    async (request, reply) => {
      const { state } = request.params;

      try {
        // Use the same validation as the MCP tool
        const args = { state };
        const { state: validatedState }: WeatherAlertsArgs = validateToolArgs(
          WeatherAlertsSchema,
          args
        );

        const alerts = await simulateAlertsAPI();

        return {
          alerts,
          state: validatedState,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        return reply.status(400).send({
          error: 'Invalid state code',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );
};

export default weatherPlugin;
