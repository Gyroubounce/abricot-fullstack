import { test, expect } from "@playwright/test";
import { testUsers } from "../e2e/fixtures/users";

test.describe("Tasks — CRUD complet avec projet + contributeurs + IDs", () => {
  const user = testUsers.e2e;

  test("Créer un projet → créer une tâche → tester statuts → modifier → supprimer", async ({ page }) => {
    // -------------------------------------------------------------
    // AUTHENTIFICATION
    // -------------------------------------------------------------
    await page.goto("/auth/login");
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.getByRole("button", { name: "Se connecter", exact: true }).click();
    await expect(page).toHaveURL("/dashboard");

    // -------------------------------------------------------------
    // NAVIGATION VERS PROJETS
    // -------------------------------------------------------------
    await page.getByRole("link", { name: "Projets" }).click();
    await expect(page).toHaveURL("/dashboard/projects");

    const projectName = "Projet E2E - " + Date.now();

    // -------------------------------------------------------------
    // CRÉATION DU PROJET
    // -------------------------------------------------------------
    // Vérifier si le projet existe déjà
    const projectCard = page.locator(`[aria-label="Voir le projet ${projectName}"]`).first();
    if (!(await projectCard.isVisible().catch(() => false))) {

      await page.getByRole("button", { name: /créer/i }).first().click();
      await page.fill("#project-name", projectName);
      await page.fill("#project-description", "Projet généré automatiquement pour les tests E2E");

      // --- AJOUT CONTRIBUTEURS ---
      const contributorsBtn = page.getByRole("button", { name: /collaborateurs/i });
      await contributorsBtn.click();

      const users = page.locator('button:has(span)');
      await users.nth(0).click();
      await contributorsBtn.click();
      await users.nth(1).click();

      // Création du projet
      await page.click('button[type="submit"]:has-text("Créer")');
      await expect(page).toHaveURL("/dashboard/projects");
      const card = page.locator(`[aria-label="Voir le projet ${projectName}"]`).first();
      await expect(card).toBeVisible();
      await expect(card.getByText("0/0 tâches terminées").first()).toBeVisible();
      await expect(card.getByText(/Équipe \(\d+\)/).first()).toBeVisible();
    }

    // --- NAVIGATION VERS LE PROJET ---
    await projectCard.click();
    const projectUrl = await projectCard.getAttribute("href");
    const projectId = projectUrl?.split("/").pop();
    if (!projectId) throw new Error("Impossible de récupérer l'ID du projet");

    await page.goto(`/dashboard/projects/${projectId}`);
    await expect(page).toHaveURL(`/dashboard/projects/${projectId}`);

    // -------------------------------------------------------------
    // CRÉATION TÂCHE E2E
    // -------------------------------------------------------------
    const taskTitle = "Tâche E2E";

    // Vérifier si la tâche existe déjà dans la liste
    let taskCard = page.locator(`article:has-text("${taskTitle}")`).first();

    if (!(await taskCard.isVisible().catch(() => false))) {
      // 1️⃣ Ouvrir la modale "Créer une tâche"
      await page.getByRole("button", { name: /créer une nouvelle tâche/i }).click();
      const createDialog = page.getByRole("dialog", { name: /Créer une tâche/i });
      await expect(createDialog).toBeVisible();

      // 2️⃣ Remplir les champs
      await createDialog.getByLabel("Titre de la tâche").fill(taskTitle);
      await createDialog.getByLabel("Description de la tâche").fill("Description initiale");

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dueDateStr = tomorrow.toISOString().split("T")[0];
      await createDialog.getByLabel("Date d'échéance").fill(dueDateStr);

      // 3️⃣ Sélectionner les assignés
      const assigneesBtn = createDialog.getByRole("button", { name: "Choisir des assignés" });
      await assigneesBtn.click();
      const assignees = createDialog.locator('button:has(span)');
      await assignees.first().click();       // premier assigné
      await assigneesBtn.click();            // rouvrir si nécessaire
      await assignees.nth(1).click();       // deuxième assigné

      // 4️⃣ Statut
      await createDialog.getByRole("button", { name: "À faire" }).click();

      // 5️⃣ Cliquer sur le bouton "Ajouter" (submit)
      await createDialog.getByRole("button", { name: /ajouter/i }).click();

      // 6️⃣ Attendre que la modale disparaisse
      await expect(createDialog).toHaveCount(0);

      // 7️⃣ Vérifier que la tâche apparaît dans la liste
      taskCard = page.locator(`div[aria-label="Tâche : ${taskTitle}"]`).first();
      await expect(taskCard).toBeVisible({ timeout: 15000 });

      console.log("Task créée avec succès !");
    }

    // -------------------------------------------------------------
    // RÉCUPÉRATION taskCard (plus d’ID nécessaire)
    // -------------------------------------------------------------
    const taskCardById = taskCard; // utiliser directement le locator
    await expect(taskCardById).toBeVisible();

    // -------------------------------------------------------------
    // TEST STATUT
    // -------------------------------------------------------------
    const optionsBtn = taskCardById.getByRole("button", { name: /options/i }).first();
    await optionsBtn.click();
    await page.getByRole("menuitem", { name: "En cours" }).click();
    await expect(taskCardById.getByText("En cours").first()).toBeVisible();

    // -------------------------------------------------------------
    // MODIFICATION TÂCHE
    // -------------------------------------------------------------
    await optionsBtn.click();
    await page.getByRole("menuitem", { name: "Modifier" }).click();
    const editDialog = page.getByRole("dialog", { name: /Modifier la tâche/i });
    await expect(editDialog).toBeVisible();

    await editDialog.getByLabel("Titre de la tâche").fill("Tâche modifiée");
    await editDialog.getByLabel("Description de la tâche").fill("Description modifiée");

    const afterTomorrow = new Date();
    afterTomorrow.setDate(afterTomorrow.getDate() + 2);
    await editDialog.getByLabel("Date d'échéance").fill(afterTomorrow.toISOString().split("T")[0]);

    await editDialog.getByRole("button", { name: "Terminée" }).click();
    
    // Après avoir enregistré la modification
    await editDialog.getByRole("button", { name: /enregistrer/i }).click();

    // Attendre que la modale disparaisse
    await expect(editDialog).toHaveCount(0);

    // Re-localiser la tâche modifiée
    const updatedTaskCard = page.locator(`div[aria-label="Tâche : Tâche modifiée"]`).first();
    await expect(updatedTaskCard).toBeVisible();

    // Vérifier contenu
    await expect(updatedTaskCard.getByText("Terminée").first()).toBeVisible();

    // -------------------------------------------------------------
    // SUPPRESSION TÂCHE
    // -------------------------------------------------------------
    // Comme la tâche disparaît à la suppression, il suffit de cliquer sur le bouton options de la tâche actuelle
    const updatedOptionsBtn = updatedTaskCard.getByRole("button", { name: /options/i }).first();
    await updatedOptionsBtn.click();
    await page.getByRole("menuitem", { name: /supprimer/i }).click();

    // Attendre que la tâche disparaisse
    await expect(page.locator(`div[aria-label="Tâche : Tâche modifiée"]`)).toHaveCount(0);
  });
});