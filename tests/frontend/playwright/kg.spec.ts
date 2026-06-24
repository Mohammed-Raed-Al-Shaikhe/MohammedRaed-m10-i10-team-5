// Frontend lead — Playwright smoke test for the /kg page.
// Runs against the running Compose stack with the recipe graph seeded
// (scripts/seed_neo4j.sh). Verifies a seeded question returns Cypher
// rows rendered as data-testid="kg-row".
import { test, expect } from '@playwright/test';

test('kg page renders rows for a seeded question', async ({ page }) => {
  await page.goto('/kg');
  await expect(page.getByRole('heading', { name: /Knowledge Graph/i })).toBeVisible();

  await page.locator('input').fill('Find Sichuan recipes');
  await page.getByRole('button', { name: /Ask/i }).click();

  await expect(page.locator('[data-testid="kg-row"]').first()).toBeVisible({
    timeout: 15_000,
  });
});
