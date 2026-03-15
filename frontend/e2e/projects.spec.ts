import { test, expect } from "@playwright/test";

test.describe("Projects — CRUD complet (UI réelle)", () => {

  test.beforeEach(async ({ page }) => {
    // Connexion utilisateur E2E
    await page.goto("/auth/login");

    await page.fill('input[name="email"]', "e2e@example.com");
    await page.fill('input[name="password"]', "TestPassword123!");

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard");

    // Navigation vers la liste des projets
    await page.click('a:has-text("Projets")');
    await expect(page).toHaveURL("/dashboard/projects");
  });

  test("Créer, afficher, modifier et supprimer un projet", async ({ page }) => {

    // --- 1) CRÉATION ---
    // On ouvre le modal
    await page.click('[aria-label="Créer un nouveau projet"]');

    // On remplit le formulaire
    await page.fill("#project-name", "Projet E2E");
    await page.fill("#project-description", "Description du projet E2E");

    // On crée le projet
    await page.click('button[type="submit"]:has-text("Créer")');

    // On reste sur /dashboard/projects
    await expect(page).toHaveURL("/dashboard/projects");

    // Vérification de la carte du projet
    const card = page.locator('[aria-label="Voir le projet Projet E2E"]');
    await expect(card).toBeVisible();

    // Vérification des infos affichées
    await expect(card.getByText("0/0 tâches terminées")).toBeVisible();
    await expect(card.getByText("Équipe (1)")).toBeVisible();

    // --- 2) NAVIGATION ---
    // On clique sur la carte → page du projet
    await card.click();

    // 🔥 Récupération de l’ID du projet créé
    const projectId = page.url().split("/").pop();

    await expect(page).toHaveURL(/\/dashboard\/projects\/.+/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Projet E2E");

    // --- 3) MODIFICATION ---
    await page.click('button:has-text("Modifier")');

    await page.fill("#project-name", "Projet E2E Modifié");
    await page.fill("#project-description", "Nouvelle description");

    await page.click('button[type="submit"]:has-text("Enregistrer")');

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Projet E2E Modifié");

    // --- 4) SUPPRESSION ---
    await page.click('button:has-text("modifier"), button:has-text("Modifier")');
    await page.click('button:has-text("Supprimer le projet")');

    const confirmModal = page.getByRole("dialog", { name: "Supprimer le projet" });
    await expect(confirmModal).toBeVisible();

    await confirmModal.getByRole("button", { name: "Confirmer" }).click();

    await expect(page).toHaveURL("/dashboard/projects");

    // Vérification que la carte n’existe plus
    await expect(page.locator(`[href="/dashboard/projects/${projectId}"]`)).toHaveCount(0);
  });
});
