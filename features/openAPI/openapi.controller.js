import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const controller = {
  getOpenApiSpec: async (req, res) => {
    try {
      // Construct path to the openapi.json file in assets folder
      const projectRoot = path.resolve(__dirname, '../../');
      const openApiFilePath = path.join(projectRoot, 'assets', 'openapi.json');

      // Read the openapi.json file
      const openApiContent = fs.readFileSync(openApiFilePath, 'utf8');
      const openApiSpec = JSON.parse(openApiContent);

      // Set appropriate headers
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');

      res.json(openApiSpec);
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.status(404).json({ error: 'OpenAPI specification file not found' });
      } else {
        res.status(500).json({ error: 'Failed to load OpenAPI specification' });
      }
    }
  }
};

export default controller;
