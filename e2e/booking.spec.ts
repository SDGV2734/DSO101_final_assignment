import { expect, test } from "@playwright/test";

test("student can register and reach booking workflows", async ({ page }) => {
  const stamp = Date.now();
  const email = `e2e-${stamp}@cst.local`;

  await page.goto("/register");
  await page.getByLabel("Full name").fill("E2E Student");
  await page.getByLabel("Student ID").fill(`E2E-${stamp}`);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("CorrectHorse123");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText("Student dashboard")).toBeVisible();

  await page.getByRole("link", { name: "Laundry" }).click();
  await expect(page.getByText("Laundry booking")).toBeVisible();
  await expect(page.getByText("Available slots")).toBeVisible();

  await page.getByRole("link", { name: "Ground" }).click();
  await expect(page.getByText("Football ground")).toBeVisible();
  await expect(page.getByText("Available slots")).toBeVisible();
});
