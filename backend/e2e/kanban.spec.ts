import { test, expect } from "@playwright/test";
import { testUsers } from "../e2e/fixtures/users";

test.describe("Dashboard — Vue Liste et Kanban", () => {
  const user = testUsers.e2e;

  test.beforeEach(async ({ page }) => {
    // Authentification
    await page.goto("/auth/login");
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.getByRole("button", { name: "Se connecter", exact: true }).click();
    await expect(page).toHaveURL("/dashboard");
  });

  test("Créer projet + tâches assignées → tester vue Liste et Kanban", async ({ page }) => {
    // Navigation vers Projets
    await page.getByRole("link", { name: "Projets" }).click();
    await expect(page).toHaveURL("/dashboard/projects");

    // Nom unique pour le projet
    const projectName = "Projet E2E Dashboard";

    // Vérifier si le projet existe déjà
    const projectCard = page.locator(`[aria-label="Voir le projet ${projectName}"]`).first();
    if (!(await projectCard.isVisible().catch(() => false))) {
      // Créer un projet
      await page.getByRole("button", { name: /créer/i }).first().click();
      await page.fill("#project-name", projectName);
      await page.fill("#project-description", "Projet pour tests Dashboard E2E");

      // Ajouter contributeurs (le test user et un autre)
      // Ouvrir la modale des contributeurs
        const contributorsBtn = page.getByRole("button", { name: /collaborateurs/i });
        await contributorsBtn.click();

        // Attendre que tous les utilisateurs soient visibles
        const users = page.locator('button:has(span)');
        await users.nth(11).click();
        
        

        
      // Création du projet
      await page.click('button[type="submit"]:has-text("Créer")');
      await expect(page.locator(`[aria-label="Voir le projet ${projectName}"]`)).toBeVisible();
    }

    // Naviguer dans le projet
    await projectCard.click();
    const projectUrl = await projectCard.getAttribute("href");
    const projectId = projectUrl?.split("/").pop();
    if (!projectId) throw new Error("Impossible de récupérer l'ID du projet");
    await page.goto(`/dashboard/projects/${projectId}`);
    await expect(page).toHaveURL(`/dashboard/projects/${projectId}`);

    // -------------------------------------------------------------
    // CRÉER PLUSIEURS TÂCHES ASSIGNÉES AU TEST USER
    // -------------------------------------------------------------
    const tasksToCreate = ["Tâche 1", "Tâche 2", "Tâche 3"];
    for (const title of tasksToCreate) {
      const taskCard = page.locator(`div[aria-label="Tâche : ${title}"]`).first();
      if (!(await taskCard.isVisible().catch(() => false))) {
        // Ouvrir modale création
        await page.getByRole("button", { name: /créer une nouvelle tâche/i }).click();
        const createDialog = page.getByRole("dialog", { name: /Créer une tâche/i });
        await expect(createDialog).toBeVisible();

        await createDialog.getByLabel("Titre de la tâche").fill(title);
        await createDialog.getByLabel("Description de la tâche").fill(`Description de ${title}`);

        // Date d'échéance demain
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        await createDialog.getByLabel("Date d'échéance").fill(tomorrow.toISOString().split("T")[0]);

        // Assignation au test user (dernier de la liste)
        const assigneesBtn = createDialog.getByRole("button", { name: "Choisir des assignés" });
        await assigneesBtn.click();
        const assignees = createDialog.locator('button:has(span)');
        await assignees.last().click();

        // Statut par défaut
        await createDialog.getByRole("button", { name: "À faire" }).click();

        // Ajouter
        await createDialog.getByRole("button", { name: /ajouter/i }).click();
        await expect(createDialog).toHaveCount(0);

        // Vérifier que la tâche est visible
        const newTaskCard = page.locator(`div[aria-label="Tâche : ${title}"]`).first();
        await expect(newTaskCard).toBeVisible({ timeout: 10000 });
      }
    }

   

    // Assurer que l'on est sur le Dashboard pour que toutes les tâches soient visibles
    await page.getByRole("link", { name: "Tableau de bord", exact: true }).click();
    await expect(page).toHaveURL("/dashboard");

   

    // -------------------------------------------------------------
    // TEST VUE KANBAN
    // -------------------------------------------------------------
    await page.getByRole("button", { name: "Kanban" }).click();
    for (const col of ["À faire", "En cours", "Terminées"]) {
      const column = page.locator(`section[aria-label*="Colonne ${col}"]`);
      await expect(column).toBeVisible();
    }

    // Localiser les colonnes
    const aFaireColumn = page.locator(`section[aria-label*="Colonne À faire"] div[aria-label^="Tâche :"]`);
    const enCoursColumn = page.locator(`section[aria-label*="Colonne En cours"]`);

    // Déplacer chaque tâche dans "En cours"
    for (let i = 0; i < tasksToCreate.length; i++) {
    const task = aFaireColumn.nth(i);
    await task.dragTo(enCoursColumn);
    }

    // Vérifier que toutes les tâches sont maintenant dans "En cours"
    const enCoursTasks = page.locator(`section[aria-label*="Colonne En cours"] div[aria-label^="Tâche :"]`);
    await expect(enCoursTasks).toHaveCount(tasksToCreate.length);
  });
});