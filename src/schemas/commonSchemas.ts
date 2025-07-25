import { z } from 'zod';

/**
 * Common Zod schemas for MCP projects
 * Reusable validation patterns for typical MCP tool arguments
 */

// Common coordinate schemas
export const LatitudeSchema = z
  .number()
  .min(-90, 'Latitude must be between -90 and 90')
  .max(90, 'Latitude must be between -90 and 90')
  .describe('Latitude coordinate');

export const LongitudeSchema = z
  .number()
  .min(-180, 'Longitude must be between -180 and 180')
  .max(180, 'Longitude must be between -180 and 180')
  .describe('Longitude coordinate');

export const CoordinatesSchema = z.object({
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
});

// Common location schemas
export const CitySchema = z
  .string()
  .min(1, 'City name is required')
  .max(100, 'City name cannot exceed 100 characters')
  .describe('City name');

export const CountrySchema = z
  .string()
  .min(2, 'Country code must be at least 2 characters')
  .max(3, 'Country code cannot exceed 3 characters')
  .describe('Country code (ISO 3166-1 alpha-2 or alpha-3)');

export const StateSchema = z
  .string()
  .length(2, 'State code must be exactly 2 characters')
  .regex(/^[A-Z]{2}$/, 'State code must be 2 uppercase letters')
  .describe('Two-letter US state code (e.g., CA, NY, TX)');

// Common date/time schemas
export const DateSchema = z
  .string()
  .datetime(
    'Invalid date format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)'
  )
  .describe('Date in ISO 8601 format');

export const DateRangeSchema = z
  .object({
    startDate: DateSchema,
    endDate: DateSchema,
  })
  .refine(data => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'Start date must be before or equal to end date',
    path: ['endDate'],
  });

// Common pagination schemas
export const PaginationSchema = z.object({
  page: z
    .number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1)
    .describe('Page number (1-based)'),
  limit: z
    .number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10)
    .describe('Number of items per page'),
});

// Common search schemas
export const SearchQuerySchema = z
  .string()
  .min(1, 'Search query is required')
  .max(500, 'Search query cannot exceed 500 characters')
  .describe('Search query string');

export const SearchOptionsSchema = z.object({
  query: SearchQuerySchema,
  caseSensitive: z
    .boolean()
    .default(false)
    .describe('Whether the search should be case sensitive'),
  exactMatch: z
    .boolean()
    .default(false)
    .describe('Whether to search for exact matches only'),
});

// Common file schemas
export const FilePathSchema = z
  .string()
  .min(1, 'File path is required')
  .max(500, 'File path cannot exceed 500 characters')
  .describe('File path');

export const FileExtensionSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9]+$/,
    'File extension must contain only alphanumeric characters'
  )
  .describe('File extension (without dot)');

// Common API schemas
export const ApiKeySchema = z
  .string()
  .min(1, 'API key is required')
  .describe('API key for external service');

export const UrlSchema = z
  .string()
  .url('Invalid URL format')
  .describe('Valid URL');

// Common user input schemas
export const EmailSchema = z
  .string()
  .email('Invalid email format')
  .describe('Valid email address');

export const PhoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')
  .describe('Phone number');

export const NameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name cannot exceed 100 characters')
  .describe("Person's name");

// Type exports
export type Coordinates = z.infer<typeof CoordinatesSchema>;
export type DateRange = z.infer<typeof DateRangeSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type SearchOptions = z.infer<typeof SearchOptionsSchema>;
