import { Page, expect } from '@playwright/test';

/**
 * Vérifie le nombre de contributeurs affichés
 */
export async function verifyContributorsCount(page: Page, expectedCount: number) {
  const text = await page.locator('text=/Contributeurs.*personnes?/').first().textContent();
  expect(text).toContain(`${expectedCount} personne${expectedCount > 1 ? 's' : ''}`);
}

/**
 * Vérifie le compteur de tâches terminées
 */
export async function verifyTasksCount(page: Page, completed: number, total: number) {
  const text = await page.locator('text=/\\d+\\/\\d+ tâches? terminées?/').first().textContent();
  expect(text).toContain(`${completed}/${total} tâche${total > 1 ? 's' : ''}`);
}

/**
 * Vérifie la barre de progression
 */
export async function verifyProgressBar(page: Page, percentage: number) {
  const progressBar = page.locator('[role="progressbar"] > div').first();
  const width = await progressBar.evaluate(el => (el as HTMLElement).style.width);
  expect(width).toBe(`${percentage}%`);
}

/**
 * Vérifie qu'un utilisateur est connecté (nom affiché)
 */
export async function verifyUserLoggedIn(page: Page, userName: string) {
  await expect(page.locator('text=' + userName)).toBeVisible();
}