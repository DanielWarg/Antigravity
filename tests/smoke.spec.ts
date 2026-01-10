import { test, expect } from '@playwright/test';

test('smoke test - homepage loads', async ({ page }) => {
    await page.goto('/');

    // Check for the main heading
    await expect(page.getByRole('heading', { name: 'Antigravity' })).toBeVisible();

    // Check for the description text
    await expect(page.getByText('Prompt-first collaborative canvas.')).toBeVisible();

    // Check that the "New Board" button exists and navigates
    const newBoard = page.getByRole('button', { name: 'New Board', exact: true });
    await expect(newBoard).toBeVisible();
    await newBoard.click();
    await expect(page).toHaveURL(/\/board\/.+/);
});
