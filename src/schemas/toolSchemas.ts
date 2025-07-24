import { z } from 'zod';
import { NameSchema, StateSchema, LatitudeSchema, LongitudeSchema } from './commonSchemas.js';

/**
 * Zod schemas for MCP tool argument validation
 * Provides type-safe runtime validation with descriptive error messages
 */

// Schema for sayHello tool arguments
export const SayHelloSchema = z.object({
  name: NameSchema
});

// Schema for calculate tool arguments
export const CalculateSchema = z.object({
  operation: z.enum(['add', 'subtract', 'multiply', 'divide'], {
    errorMap: () => ({ message: "Operation must be one of: add, subtract, multiply, divide" })
  }).describe("The arithmetic operation to perform"),
  a: z.number()
    .describe("First number for the calculation"),
  b: z.number()
    .describe("Second number for the calculation")
}).refine(
  (data) => {
    if (data.operation === 'divide' && data.b === 0) {
      return false;
    }
    return true;
  },
  {
    message: "Division by zero is not allowed",
    path: ["b"]
  }
);

// Schema for weather forecast tool (example for future expansion)
export const WeatherForecastSchema = z.object({
  latitude: LatitudeSchema,
  longitude: LongitudeSchema
});

// Schema for weather alerts tool (example for future expansion)
export const WeatherAlertsSchema = z.object({
  state: StateSchema
});

// Type exports for TypeScript usage
export type SayHelloArgs = z.infer<typeof SayHelloSchema>;
export type CalculateArgs = z.infer<typeof CalculateSchema>;
export type WeatherForecastArgs = z.infer<typeof WeatherForecastSchema>;
export type WeatherAlertsArgs = z.infer<typeof WeatherAlertsSchema>;

/**
 * Utility function to validate tool arguments with better error handling
 */
export function validateToolArgs<T>(schema: z.ZodSchema<T>, args: unknown): T {
  try {
    return schema.parse(args);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    throw error;
  }
} 