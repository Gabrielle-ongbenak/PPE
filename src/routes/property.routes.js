import { Router } from "express";

import {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

import Property from "../models/property.model.js";

const propertyRouter = Router();

// ======================================================
//                PUBLIC ROUTES
//=======================================================

propertyRouter.get("/", getProperties);
propertyRouter.get("/:id", getProperty);

// ======================================================
//                PRIVATE ROUTES
//=======================================================

propertyRouter.post("/", authMiddleware, createProperty);

// UPDATE property
propertyRouter.put("/:id", authMiddleware, updateProperty);

// DELETE property
propertyRouter.delete("/:id", authMiddleware, deleteProperty);

export default propertyRouter;
