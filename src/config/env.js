import { config } from "dotenv";

// On ne cherche le fichier local QUE si on n'est pas sur Vercel
if (!process.env.VERCEL) {
  config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
}

export const { NODE_ENV, DB_URI, PORT, JWT_SECRET, JWT_EXPIRES_IN } =
  process.env;
