// openapi-types.d.ts

/**
 * Represents a single response object in OpenAPI
 */
export interface OpenApiResponse {
  description: string;
  headers?: Record<string, any>;
  content?: {
    [contentType: string]: {
      schema?: any;
      example?: any;
      examples?: Record<string, any>;
    };
  };
}

/**
 * Represents a single operation (GET, POST, etc.) on a path
 */
export interface OpenApiOperation {
  summary?: string;
  description?: string;
  operationId: string;
  tags?: string[];
  parameters?: OpenApiParameter[];
  requestBody?: OpenApiRequestBody;
  responses: Record<string, OpenApiResponse>;
  deprecated?: boolean;
}

/**
 * Represents a parameter (query, path, header, cookie)
 */
export interface OpenApiParameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  required?: boolean;
  description?: string;
  schema: any;
}

/**
 * Represents a requestBody object
 */
export interface OpenApiRequestBody {
  description?: string;
  required?: boolean;
  content: {
    [contentType: string]: {
      schema?: any;
      example?: any;
      examples?: Record<string, any>;
    };
  };
}

/**
 * Represents all operations for a path (e.g., /todos)
 */
export interface OpenApiPathItem {
  get?: OpenApiOperation;
  post?: OpenApiOperation;
  put?: OpenApiOperation;
  delete?: OpenApiOperation;
  patch?: OpenApiOperation;
  options?: OpenApiOperation;
  head?: OpenApiOperation;
  trace?: OpenApiOperation;
  [method: string]: OpenApiOperation | undefined;
}

/**
 * Represents the `paths` object of the OpenAPI spec
 */
export interface OpenApiPaths {
  [path: string]: OpenApiPathItem;
}

/**
 * Represents schemas used in components
 */
export interface OpenApiComponents {
  schemas?: Record<string, any>;
  responses?: Record<string, any>;
  parameters?: Record<string, any>;
  requestBodies?: Record<string, any>;
  headers?: Record<string, any>;
  securitySchemes?: Record<string, any>;
  [key: string]: any;
}

/**
 * Represents the full OpenAPI spec
 */
export interface OpenApiSpec {
  openapi: string; // e.g. "3.0.3"
  info: {
    title: string;
    version: string;
    description?: string;
    termsOfService?: string;
    contact?: {
      name?: string;
      url?: string;
      email?: string;
    };
    license?: {
      name: string;
      url?: string;
    };
  };
  servers?: {
    url: string;
    description?: string;
  }[];
  tags?: {
    name: string;
    description?: string;
  }[];
  paths: OpenApiPaths;
  components?: OpenApiComponents;
  security?: Record<string, any>[];
  externalDocs?: {
    description?: string;
    url: string;
  };
}

/**
 * Initialises the OpenAPI spec
 */
interface OpenAPISpecInit {
  (): void
}
