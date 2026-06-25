// Frontend lead — Playwright smoke test for the /extract page.
// Runs against the running Compose stack (web on :3000 → api on :8000).
// Verifies the page renders, accepts input, and displays typed entity
// spans (data-testid="entity-span") returned by the api /extract endpoint.
import { test, expect } from '@playwright/test';

test('extract page renders and returns typed entities', async ({ page }) => {
  await page.goto('/extract');
  await expect(page.getByRole('heading', { name: /Extract/i })).toBeVisible();

  await page.locator('textarea').fill('Akira Kurosawa directed Seven Samurai in 1954.');
  await page.getByRole('button', { name: /Extract/i }).click();

  // The api lifespan-loaded spaCy pipeline returns at least one entity.
  await expect(page.locator('[data-testid="entity-span"]').first()).toBeVisible({
    timeout: 15_000,
  });
});
