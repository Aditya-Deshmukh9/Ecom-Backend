import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT,
  mongodb_url: process.env.MONGODB_URL,
  jwtsecret: process.env.JWT_SECRET,
  frontend_domain: process.env.FRONTEND_DOMAIN,
  env: process.env.NODE_ENV,
};

export const config = Object.freeze(_config);
