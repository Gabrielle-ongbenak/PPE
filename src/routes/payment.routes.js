import { Router } from "express";

import {
  createPayment,
  webhook,
} from "../controllers/subscription.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const paymentRouter = Router();

paymentRouter.post("/", authMiddleware, createPayment);
paymentRouter.post("/webhook/:id", webhook);

export default paymentRouter;
