import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";
import { ac, admin as adminRole, user, superadmin } from "./permissions.js";
import "dotenv/config";

const envOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      ac,
      roles: {
        admin: adminRole,
        user,
        superadmin,
      },
      defaultRole: "user",
      adminRoles: ["admin", "superadmin"],
    }),
  ],
  trustedOrigins: [
    ...envOrigins,
    "http://localhost:5173",
    "http://43.157.248.166",
    "http://43.157.248.166:6969",
    "http://43.157.248.166:9696",
    "https://cuantrack.zvy.my.id",
  ],
});
