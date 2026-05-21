import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const expectNoAccessibilityViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page }).analyze();
  if (results.violations.length > 0) {
    console.log(
      results.violations
        .map(
          (violation) =>
            `${violation.id}: ${violation.help} (${violation.nodes.length} node${
              violation.nodes.length === 1 ? "" : "s"
            })`
        )
        .join("\n")
    );
  }
  expect(results.violations).toEqual([]);
};

test("student can register and reach booking workflows", async ({ page }) => {
  const stamp = Date.now();
  const email = `e2e-${stamp}@cst.local`;

  await page.goto("/register");

  await expect(
    page.getByRole("heading", { name: "Create account" }),
    "The registration page did not render. Check that STAGING_URL points to the deployed frontend, not the backend."
  ).toBeVisible({ timeout: 15000 });
  await expectNoAccessibilityViolations(page);

  await page.getByLabel("Full name").fill("E2E Student");
  await page.getByLabel("Student ID").fill(`E2E-${stamp}`);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("CorrectHorse123");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText("Student dashboard")).toBeVisible();
  await expectNoAccessibilityViolations(page);

  await page.getByRole("link", { name: "Laundry" }).click();
  await expect(page.getByText("Laundry booking")).toBeVisible();
  await expect(page.getByText("Available slots")).toBeVisible();
  await expectNoAccessibilityViolations(page);

  await page.getByRole("link", { name: "Ground" }).click();
  await expect(page.getByRole("heading", { name: "Claim the pitch." })).toBeVisible();
  await expect(page.getByText("Available slots")).toBeVisible();
  await expectNoAccessibilityViolations(page);
});
