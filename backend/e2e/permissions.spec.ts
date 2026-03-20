import { test, expect } from "@playwright/test";
import { testUsers } from "../e2e/fixtures/users";

test.describe("Permissions utilisateur — Dashboard et tâches", () => {
  const user = testUsers.caroline;

  test.beforeEach(async ({ page }) => {
    // Connexion
    await page.goto("/auth/login");
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.getByRole("button", { name: "Se connecter", exact: true }).click();
    await expect(page).toHaveURL("/dashboard");
  });

  test("Vérifier les tâches assignées et options de tâche", async ({ page }) => {
    // 1️⃣ Vérifier si l'utilisateur a des tâches assignées
    const assignedTasks = page.locator('div[aria-label^="Tâche :"]');
    const taskCount = await assignedTasks.count();
    if (taskCount === 0) {
      console.log("Aucune tâche assignée à cet utilisateur.");
      return;
    }

    // 2️⃣ Récupérer le nom de la première tâche
    const firstTask = assignedTasks.first();
    const taskName = (await firstTask.locator('h3').textContent())?.trim();
    if (!taskName) throw new Error("Impossible de récupérer le nom de la tâche");

    // 3️⃣ Aller sur la page des projets
    await page.getByRole("link", { name: "Projets" }).click();
    await expect(page).toHaveURL("/dashboard/projects");

    // 4️⃣ Cliquer sur la carte projet correspondante
    // Ici on utilise le nom exact du projet pour Caroline
    const projectCard = page.locator('a[aria-label="Voir le projet Application E-commerce"]').first();
    await expect(projectCard).toBeVisible();
    await projectCard.click();

    // 5️⃣ Vérifier que le bouton "Modifier le projet" n'est pas présent pour un utilisateur non-propriétaire
    const editProjectButton = page.locator('button:has-text("Modifier")');
    await expect(editProjectButton).toHaveCount(0);

    // 6️⃣ Vérifier que la tâche assignée est visible
    const taskCard = page.locator(`div[aria-label^="Tâche : ${taskName}"]`).first();
    await expect(taskCard).toBeVisible();

    // Cliquer sur le bouton "Options de la tâche"
    const optionsButton = taskCard.locator('button[aria-label="Options de la tâche"]').first();
    await expect(optionsButton).toBeVisible();
    await optionsButton.click();

    // Vérifier les items dans le menu global
    const menuItemModifier = page.getByRole('menuitem', { name: 'Modifier' });
    const menuItemSupprimer = page.getByRole('menuitem', { name: 'Supprimer' });

    await expect(menuItemModifier).toBeVisible();
    await expect(menuItemSupprimer).toBeVisible();
  });
});