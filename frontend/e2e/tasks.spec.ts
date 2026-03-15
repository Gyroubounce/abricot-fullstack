import { test, expect } from "@playwright/test";

const e2eUser = {
  email: "e2e@example.com",
  password: "TestPassword123!"
};

test.describe("Tasks — CRUD complet", () => {

  test.beforeEach(async ({ page }) => {
    // Connexion
    await page.goto("/auth/login");
    await page.fill('input[name="email"]', e2eUser.email);
    await page.fill('input[name="password"]', e2eUser.password);
    await page.getByRole("button", { name: "Se connecter", exact: true }).click();

    await expect(page).toHaveURL("/dashboard");

    // Aller sur Projets
    await page.getByRole("link", { name: "Projets" }).click();
    await expect(page).toHaveURL("/dashboard/projects");

    // 🔥 On récupère la carte du projet créé dans projects.spec.ts
    const projectCard = page.locator('[aria-label="Voir le projet Projet E2E"]');
    await expect(projectCard).toBeVisible();

    // 🔥 On récupère l’ID du projet via son href
    const projectUrl = await projectCard.getAttribute("href");
    const projectId = projectUrl?.split("/").pop();

    // On ouvre la page du projet
    await page.goto(`/dashboard/projects/${projectId}`);
    await expect(page).toHaveURL(`/dashboard/projects/${projectId}`);
  });

  // -------------------------------------------------------------
  // CRÉATION
  // -------------------------------------------------------------
  test("Créer une tâche", async ({ page }) => {
    // On vérifie qu'il n'y a pas encore de tâches
    await expect(page.getByText("Aucune tâche pour le moment.")).toBeVisible();

    // Ouvrir la modale
    await page.getByRole("button", { name: "Créer une nouvelle tâche" }).click();

    // Remplir les champs
    await page.fill("#task-title", "Ma première tâche");
    await page.fill("#task-description", "Description de la tâche");

    // Date d’échéance
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formatted = tomorrow.toISOString().split("T")[0];
    await page.fill("#task-due-date", formatted);

    // Assignation
    await page.getByRole("combobox", { name: "Assigné à" }).click();
    await page.getByRole("listbox").getByRole("option").first().click();

    // Statut
    const todoBtn = page.getByRole("button", { name: "À faire" });
    await todoBtn.click();

    // Soumettre
    await page.getByRole("button", { name: "+ Ajouter une tâche" }).click();

    // Vérification
    await expect(page.getByText("Ma première tâche")).toBeVisible();
  });

  // -------------------------------------------------------------
  // MODIFICATION
  // -------------------------------------------------------------
  test("Modifier une tâche", async ({ page }) => {
    // Création rapide d’une tâche
    await page.getByRole("button", { name: "Créer une tâche" }).click();
    await page.fill("#task-title", "Tâche à modifier");
    await page.fill("#task-description", "Description initiale");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.fill("#task-due-date", tomorrow.toISOString().split("T")[0]);

    await page.getByRole("button", { name: "À faire" }).click();
    await page.getByRole("button", { name: "Créer une tâche" }).click();

    // Sélection de la carte
    const taskCard = page.locator('article:has-text("Tâche à modifier")');
    await expect(taskCard).toBeVisible();

    // Ouvrir la modale d’édition
    await taskCard.getByRole("button", { name: /Modifier/i }).click();

    await expect(page.getByRole("dialog", { name: "Modifier une tâche" })).toBeVisible();

    // Modifier les champs
    await page.fill("#task-title", "Tâche modifiée");
    await page.fill("#task-description", "Nouvelle description");

    await page.getByRole("button", { name: "En cours" }).click();

    await page.getByRole("button", { name: "Enregistrer" }).click();

    // Vérification
    await expect(page.getByText("Tâche modifiée")).toBeVisible();
    await expect(page.getByText("En cours")).toBeVisible();
  });

  // -------------------------------------------------------------
  // CHANGEMENT DE STATUT
  // -------------------------------------------------------------
  test("Changer le statut d'une tâche", async ({ page }) => {
    // Création rapide
    await page.getByRole("button", { name: "Créer une tâche" }).click();
    await page.fill("#task-title", "Tâche à compléter");
    await page.fill("#task-description", "Description");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.fill("#task-due-date", tomorrow.toISOString().split("T")[0]);

    await page.getByRole("button", { name: "À faire" }).click();
    await page.getByRole("button", { name: "Créer une tâche" }).click();

    const taskCard = page.locator('article:has-text("Tâche à compléter")');
    await expect(taskCard.getByText("À faire")).toBeVisible();

    // Modifier le statut
    await taskCard.getByRole("button", { name: /Modifier/i }).click();
    await page.getByRole("button", { name: "Terminée" }).click();
    await page.getByRole("button", { name: "Enregistrer" }).click();

    // Vérification
    await expect(taskCard.getByText("Terminée")).toBeVisible();
    await expect(page.getByText("1/1 tâche terminée")).toBeVisible();
  });

  // -------------------------------------------------------------
  // ASSIGNATION
  // -------------------------------------------------------------
  test("Assigner une tâche à un utilisateur", async ({ page }) => {
    await page.getByRole("button", { name: "Créer une tâche" }).click();
    await page.fill("#task-title", "Tâche assignée");
    await page.fill("#task-description", "Description");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.fill("#task-due-date", tomorrow.toISOString().split("T")[0]);

    await page.getByRole("button", { name: "À faire" }).click();

    // Ouvrir la liste des collaborateurs
    await page.getByRole("button", { name: "Choisir un ou plusieurs collaborateurs" }).click();

    // Sélection du premier collaborateur
    await page.locator('div[role="group"] button').first().click();

    await page.getByRole("button", { name: "Créer une tâche" }).click();

    await expect(page.getByText("Tâche assignée")).toBeVisible();
  });

  // -------------------------------------------------------------
  // SUPPRESSION
  // -------------------------------------------------------------
  test("Supprimer une tâche", async ({ page }) => {
    await page.getByRole("button", { name: "Créer une tâche" }).click();
    await page.fill("#task-title", "Tâche à supprimer");
    await page.fill("#task-description", "Description");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.fill("#task-due-date", tomorrow.toISOString().split("T")[0]);

    await page.getByRole("button", { name: "À faire" }).click();
    await page.getByRole("button", { name: "Créer une tâche" }).click();

    const taskCard = page.locator('article:has-text("Tâche à supprimer")');
    await expect(taskCard).toBeVisible();

    // Supprimer
    await taskCard.getByRole("button", { name: /Supprimer/i }).click();

    const confirmDialog = page.getByRole("dialog", { name: "Supprimer la tâche" });
    await expect(confirmDialog).toBeVisible();

    await confirmDialog.getByRole("button", { name: "Confirmer" }).click();

    // Vérification
    await expect(page.getByText("Tâche à supprimer")).toHaveCount(0);
    await expect(page.getByText("Aucune tâche pour le moment.")).toBeVisible();
  });
});
