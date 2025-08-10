import { Router } from "express";
import controller from "features/openAPI/openapi.controller.js";

const router = Router();

router.get('/openapi.json', controller.getOpenApiSpec);

export default router;
