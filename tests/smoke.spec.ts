import { test, expect } from '@playwright/test';

test('smoke test - homepage loads', async ({ page }) => {
    await page.goto('/');

    // Check for the main heading
    await expect(page.getByRole('heading', { name: 'Antigravity' })).toBeVisible();

    // Check for the description text
    await expect(page.getByText('Prompt-first collaborative canvas.')).toBeVisible();

    // Check that the "New Board" button works (or at least exists)
    await expect(page.getByRole('link', { name: 'New Board' }).first()).toBeVisible();
});
