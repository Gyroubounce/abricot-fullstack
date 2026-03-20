import { test, expect } from "@playwright/test";
import { testUsers } from "../e2e/fixtures/users";

test.describe("Projects — CRUD complet (UI réelle)", () => {

  const user = testUsers.e2e;

  test.beforeEach(async ({ page }) => {
    // Connexion utilisateur E2E
    await page.context().clearCookies();
    await page.goto("/auth/login");

    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard");

    // Navigation vers la liste des projets
    await page.click('a:has-text("Projets")');
    await expect(page).toHaveURL("/dashboard/projects");
  });

  test("Créer, afficher, modifier et supprimer un projet", async ({ page }) => {

    // --- 1) CRÉATION ---
    // Nom unique pour éviter doublons
    const projectName = `Projet E2E`;
    const card = page.locator(`[aria-label="Voir le projet ${projectName}"]`).first();

    if (!(await card.isVisible().catch(() => false))) {

    // créer le projet seulement si la carte n'existe pas
    // On ouvre le modal
    await page.click('[aria-label="Créer un nouveau projet"]');

    // On remplit le formulaire
    await page.fill("#project-name", projectName);
    await page.fill("#project-description", "Description du projet E2E");

    // --- AJOUT CONTRIBUTEURS ---
    let contributorsBtn = page.getByRole("button", { name: /collaborateurs/i });
    await contributorsBtn.click();

    // Sélection de 2 utilisateurs
    let users = page.locator('button:has(span)');
    await users.nth(1).click();

     contributorsBtn = page.getByRole("button", { name: /1 collaborateur/i });
    await contributorsBtn.click();

    // Sélection de 2 utilisateurs
     users = page.locator('button:has(span)');
    await users.nth(1).click();
    
    // Création du projet
    await page.click('button[type="submit"]:has-text("Créer")');

    // Vérification que nous restons sur /dashboard/projects
    await expect(page).toHaveURL("/dashboard/projects");

    // Carte du projet
    const card = page.locator(`[aria-label="Voir le projet ${projectName}"]`).first();
    await expect(card).toBeVisible();
}
    // Vérification des infos affichées
    await expect(card.getByText("0/0 tâches terminées").first()).toBeVisible();
    await expect(card.getByText(/Équipe \(\d+\)/).first()).toBeVisible();

    // --- 2) NAVIGATION ---
    await card.click();

    // 🔥 Récupération ID projet depuis href pour fiabilité
    const projectUrl = await card.getAttribute("href");
    const projectId = projectUrl?.split("/").pop();
    if (!projectId) throw new Error("Impossible de récupérer l'ID du projet");

    await expect(page).toHaveURL(`/dashboard/projects/${projectId}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(projectName);

    // --- 3) MODIFICATION ---
    await page.click('button:has-text("Modifier")');

    const modifiedName = `${projectName} Modifié`;
    await page.fill("#project-name", modifiedName);
    await page.fill("#project-description", "Nouvelle description");

    await page.click('button[type="submit"]:has-text("Enregistrer")');

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(modifiedName);

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