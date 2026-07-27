import { test, expect } from "@playwright/test";

test.describe("Compose tab", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+2");
    await page.waitForTimeout(300);
  });

  test("shows Services heading", async ({ page }) => {
    await expect(page.locator("text=Services")).toBeVisible();
  });

  test("compose output contains services block", async ({ page }) => {
    // Switch to preview on mobile if needed
    const previewBtn = page.locator("button:has-text('Preview')");
    if (await previewBtn.isVisible()) await previewBtn.click();

    const output = page.locator("pre, code").first();
    await expect(output).toContainText("services:");
  });
});

test.describe("Kubernetes tab", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+3");
    await page.waitForTimeout(300);
  });

  test("shows Kubernetes heading", async ({ page }) => {
    await expect(page.locator("text=Kubernetes")).toBeVisible();
  });

  test("k8s output contains Deployment resource", async ({ page }) => {
    const output = page.locator("pre, code").first();
    await expect(output).toContainText("kind: Deployment");
  });

  test("k8s output contains Service resource", async ({ page }) => {
    const output = page.locator("pre, code").first();
    await expect(output).toContainText("kind: Service");
  });

  test("Helm ZIP button is visible", async ({ page }) => {
    await expect(page.locator("button:has-text('Helm ZIP')")).toBeVisible();
  });
});

test.describe("Template Gallery", () => {
  test("template gallery renders on page", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Quick-Start Templates")).toBeVisible();
  });

  test("clicking a template shows applied state", async ({ page }) => {
    await page.goto("/");
    // Click first template card
    const firstCard = page.locator("[data-testid='template-card']").first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      await expect(page.locator("text=Applied!")).toBeVisible({ timeout: 2000 });
    }
  });
});
