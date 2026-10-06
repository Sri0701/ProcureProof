import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.PORT = '4010';
  process.env.FRONTEND_URL = 'http://localhost:5180';
  process.env.JWT_SECRET = 'test-secret-test-secret-test-secret';
  process.env.GEMINI_API_KEY = 'test-gemini-key';
  process.env.GEMINI_MODEL = 'gemini-2.5-flash';
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role';
  process.env.SUPABASE_BUCKET = 'documents';
  process.env.DEMO_EMAIL = 'demo@procureproof.app';
  process.env.DEMO_PASSWORD = 'DemoPass123';
});

describe('GET /api/health', () => {
  it('returns ok and a timestamp without a database call', async () => {
    const { resetEnvCache, loadEnv } = await import('./config/env');
    const { createApp } = await import('./app');
    resetEnvCache();
    const response = await request(createApp(loadEnv())).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ok: true,
      time: expect.any(String),
    });
    expect(Number.isNaN(Date.parse(response.body.time))).toBe(false);
  });

  it('returns the standard error shape for an unknown route', async () => {
    const { resetEnvCache, loadEnv } = await import('./config/env');
    const { createApp } = await import('./app');
    resetEnvCache();
    const response = await request(createApp(loadEnv())).get('/api/missing');
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
    expect(response.body.error.message).toBe('That route does not exist.');
  });
});
