import OpenAPI from "features/openAPI/openapi.class.js";
import fs from "fs";

const services = {
  generateOpenApiSpec: () => {
    const OpenAPISpec = new OpenAPI();
    return OpenAPISpec.spec;
  },
  saveOpenApiSpecToFile: () => {
    const OpenAPISpec = new OpenAPI();
    fs.writeFileSync("./assets/openapi.json", OpenAPISpec.spec);
  },
};

export default services;
