import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { createApp } from "./app";

const prisma = new PrismaClient();
const app = createApp();

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

const startServer = async () => {
 try {
 await prisma.$connect();
 console.log("✅ Connexion à la base de données établie");

 app.listen(PORT, HOST, () => {
 console.log(`🚀 Serveur démarré sur http://${HOST}:${PORT}`);
 console.log(`📊 Environnement: ${process.env.NODE_ENV || "development"}`);
 });
 } catch (error) {
 console.error("❌ Erreur lors du démarrage du serveur:", error);
 process.exit(1);
 }
};

const shutdown = async () => {
 console.log("\n🛑 Arrêt du serveur...");
 await prisma.$disconnect();
 process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();