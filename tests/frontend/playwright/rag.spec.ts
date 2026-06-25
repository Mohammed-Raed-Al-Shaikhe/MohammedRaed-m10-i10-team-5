// Frontend lead — Playwright smoke test for the /rag page.
// Runs against the running Compose stack with Weaviate seeded
// (scripts/seed_weaviate.sh). Verifies the cited answer renders and at
// least one [N]-style inline citation marker (data-testid="citation-marker")
// appears in the response.
import { test, expect } from '@playwright/test';

test('rag page renders a cited answer with [N] markers', async ({ page }) => {
  await page.goto('/rag');
  await expect(page.getByRole('heading', { name: /RAG/i })).toBeVisible();

  await page.locator('input').fill('How do I prep ginger for stir-fry?');
  await page.getByRole('button', { name: /Ask/i }).click();

  // flan-t5-base generation + Weaviate retrieval can be slow on a cold
  // cache — allow a generous timeout for the grounded answer to render.
  await expect(page.locator('[data-testid="rag-answer"]')).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('[data-testid="citation-marker"]').first()).toBeVisible({
    timeout: 30_000,
  });
});
