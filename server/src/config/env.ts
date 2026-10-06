import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const here = path.dirname(fileURLToPath(import.meta.url));

const schema = z.object({
  PORT: z.coerce.number().int().positive().default(4010),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  FRONTEND_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  GEMINI_API_KEY: z.string().min(1),
  GEMINI_MODEL: z.string().min(1).default('gemini-2.5-flash'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_BUCKET: z.string().min(1).default('documents'),
  DEMO_EMAIL: z.string().email(),
  DEMO_PASSWORD: z.string().min(8),
});

export type Env = z.infer<typeof schema>;

let cached: Env | null = null;

export function resetEnvCache() {
  cached = null;
}

export function loadEnv(): Env {
  if (cached) return cached;
  dotenv.config({ path: path.resolve(here, '../../../.env') });
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
  dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const lines = parsed.error.issues.map((issue) => {
      const key = issue.path.join('.') || 'environment';
      return `- ${key}: ${issue.message}`;
    });
    throw new Error(`Environment is invalid.\n${lines.join('\n')}`);
  }
  cached = parsed.data;
  return cached;
}
