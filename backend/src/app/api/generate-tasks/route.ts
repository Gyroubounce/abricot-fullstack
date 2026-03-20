/* src/app/api/generate-tasks/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt invalide" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Tu es un assistant de gestion de projet.
Génère une liste de tâches à partir de cette description : "${prompt}".
Réponds UNIQUEMENT en JSON valide, sans markdown ni backticks, avec ce format exact :
[
  {
    "title": "Titre de la tâche",
    "description": "Description courte",
    "priority": "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  }
]
Maximum 6 tâches. Sois précis et actionnable.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content
      .map((item: { type: string; text?: string }) =>
        item.type === "text" ? item.text : ""
      )
      .filter(Boolean)
      .join("");

    const tasks = JSON.parse(text);

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error("Erreur génération:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération des tâches" },
      { status: 500 }
    );
  }
}
  */
  // src/app/api/generate-tasks/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt invalide" },
        { status: 400 }
      );
    }

    // Simulation de génération de tâches (MOCK)
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simule un délai

    const mockTasks = [
      {
        title: "Analyser les besoins",
        description: `Analyse basée sur : "${prompt.substring(0, 50)}..."`,
        priority: "HIGH"
      },
      {
        title: "Développer la fonctionnalité",
        description: "Implémenter la solution technique",
        priority: "MEDIUM"
      },
      {
        title: "Tester et valider",
        description: "Tests unitaires et d'intégration",
        priority: "MEDIUM"
      },
      {
        title: "Déployer en production",
        description: "Mise en production et monitoring",
        priority: "LOW"
      }
    ];

    return NextResponse.json({ success: true, tasks: mockTasks });
  } catch (error) {
    console.error("Erreur génération:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération des tâches" },
      { status: 500 }
    );
  }
}