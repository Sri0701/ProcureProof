import { describe, expect, it } from 'vitest';
import { API_STATUS_OK } from '../index';

describe('API status label', () => {
  it('matches the health-page contract', () => {
    expect(API_STATUS_OK).toBe('API: ok');
  });
});
