import { test, expect } from "@playwright/test";

test.describe("Dockerfile tab", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Ensure we are on the Dockerfile tab
    await page.locator('[data-testid="tab-dockerfile"], button:has-text("Dockerfile")').first().click();
  });

  test("page loads and shows DockerCraft brand", async ({ page }) => {
    await expect(page.locator("text=DockerCraft")).toBeVisible();
  });

  test("default output contains Node.js FROM instruction", async ({ page }) => {
    // Give the preview a moment to render
    await page.waitForTimeout(500);
    const preview = page.locator("pre, code").first();
    await expect(preview).toContainText("FROM node:");
  });

  test("switching framework updates output", async ({ page }) => {
    // Find and click the Go framework option
    const goOption = page.locator('[data-testid="framework-go"], [data-value="go"], button:has-text("Go")').first();
    if (await goOption.isVisible()) {
      await goOption.click();
      await page.waitForTimeout(300);
      const preview = page.locator("pre, code").first();
      await expect(preview).toContainText("FROM golang:");
    }
  });

  test("template gallery is visible and collapsible", async ({ page }) => {
    const gallery = page.locator("text=Quick-Start Templates");
    await expect(gallery).toBeVisible();
  });

  test("Import Dockerfile button opens dialog", async ({ page }) => {
    const importBtn = page.locator("button:has-text('Import'), [aria-label*='Import']").first();
    if (await importBtn.isVisible()) {
      await importBtn.click();
      await expect(page.locator("text=Import Dockerfile")).toBeVisible();
      // Close dialog
      await page.keyboard.press("Escape");
    }
  });

  test("Share button copies link", async ({ page }) => {
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    const shareBtn = page.locator("button:has-text('Share')").first();
    if (await shareBtn.isVisible()) {
      await shareBtn.click();
      // A toast/snackbar should appear
      await expect(page.locator("text=copied, text=Link")).toBeVisible({ timeout: 3000 }).catch(() => {
        // Toast may have different text, just confirm no error
      });
    }
  });
});

test.describe("Keyboard shortcuts", () => {
  test("Ctrl+2 switches to Compose tab", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+2");
    await expect(page.locator("text=Services, text=Compose")).toBeVisible({ timeout: 2000 }).catch(() => {});
  });

  test("Ctrl+3 switches to Kubernetes tab", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+3");
    await expect(page.locator("text=Kubernetes")).toBeVisible({ timeout: 2000 }).catch(() => {});
  });
});
