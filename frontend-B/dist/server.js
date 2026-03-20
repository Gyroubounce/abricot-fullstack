"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("BOOT OK");
try {
    require("dotenv/config");
    console.log("[ENV] dotenv chargé");
}
catch (e) {
    console.error("[ENV] dotenv non chargé", e);
}
console.log("[ENV] NODE_ENV =", process.env.NODE_ENV);
console.log("[ENV] PORT =", process.env.PORT);
console.log("[ENV] DATABASE_URL =", process.env.DATABASE_URL ? "SET" : "MISSING");
console.log("[CHK] avant import Prisma");
const client_1 = require("@prisma/client");
console.log("[CHK] après import Prisma");
console.log("[CHK] avant import app");
const app_1 = require("./app");
console.log("[CHK] après import app");
const prisma = new client_1.PrismaClient();
const app = (0, app_1.createApp)();
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";
process.on("unhandledRejection", (reason) => {
    console.error("[FATAL] unhandledRejection:", reason);
});
process.on("uncaughtException", (err) => {
    console.error("[FATAL] uncaughtException:", err);
    process.exit(1);
});
async function startServer() {
    console.log("[START] Début startServer()");
    try {
        console.log("[PRISMA] Tentative de connexion...");
        await Promise.race([
            prisma.$connect(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Prisma connect timeout (10s)")), 10000)),
        ]);
        console.log("[PRISMA] ✅ Connecté");
        console.log("[HTTP] Démarrage serveur...");
        app.listen(PORT, HOST, () => {
            console.log(`[HTTP] ✅ Listen sur http://${HOST}:${PORT}`);
        });
    }
    catch (error) {
        console.error("[START] ❌ Erreur au démarrage:", error);
        try {
            console.log("[PRISMA] Disconnect (cleanup)...");
            await prisma.$disconnect();
            console.log("[PRISMA] ✅ Disconnected");
        }
        catch (e) {
            console.error("[PRISMA] ❌ Erreur disconnect:", e);
        }
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map