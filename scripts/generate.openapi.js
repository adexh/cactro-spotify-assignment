import OpenAPIService from "features/openAPI/openapi.service.js";

try {
  OpenAPIService.saveOpenApiSpecToFile();
} catch (error) {
  console.error("Error generating OpenAPI spec:", error);
}