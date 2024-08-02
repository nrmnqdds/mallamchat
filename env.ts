import { type TypeOf, z } from "zod";

const envVariables = z.object({
  // Next Auth
  AUTH_SECRET: z.string(),
  AUTH_GOOGLE_ID: z.string(),
  AUTH_GOOGLE_SECRET: z.string(),

  // Database
  DATABASE_URL: z.string(),

  // Mallam API
  MALLAM_API_KEY: z.string(),

  // Posthog
  NEXT_PUBLIC_POSTHOG_KEY: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends TypeOf<typeof envVariables> { }
  }
}
