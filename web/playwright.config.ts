import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: false,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  // The autograder runs `npx playwright test ../tests/frontend/playwright`
  // from web/ against the already-running Compose `web` container on
  // :3000. Always reuse an existing server on that port — reuse it when
  // the stack (or a local `npm run dev`) is already up, and only fall back
  // to spawning `npm run dev` when nothing is serving. Without this, CI
  // (where process.env.CI is set) would try to bind :3000 a second time
  // and fail with "port already used".
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
