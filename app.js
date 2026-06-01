import express, { json } from "express";
import { PORT } from "./src/config/env.js";
import connectToDatabase from "./src/database/mongodb.js";

import authRouter from "./src/routes/auth.routes.js";
import paymentRouter from "./src/routes/payment.routes.js";
import propertyRouter from "./src/routes/property.routes.js";

import errorMiddleware from "./src/middlewares/error.middleware.js";
import Property from "./src/models/property.model.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/properties", propertyRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the LOGI_237 API");
});

app.listen(PORT, async () => {
  console.log(`LOGI_237 API is running on http://localhost:${PORT}`);

  await connectToDatabase();
});

export default app;
