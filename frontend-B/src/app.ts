console.log("[APP] app.ts chargé");

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";

import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger"; 

import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import oauthRoutes from "./routes/oauth";

import { authenticateToken } from "./middleware/auth"; 
import { searchUsers, getAllUsers } from "./controllers/projectController"; 

export const createApp = () => {
 const app = express();

 app.use(cookieParser());
 app.use(passport.initialize());
 app.use(helmet());

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL].filter((o): o is string => Boolean(o))
    : ["http://localhost:3000"];


app.use(
 cors({
 origin: allowedOrigins,
 credentials: true,
 })
);

 app.use(morgan("combined"));
 app.use(express.json({ limit: "10mb" }));
 app.use(express.urlencoded({ extended: true }));

 // Swagger
 app.use(
 "/api-docs",
 swaggerUi.serve,
 swaggerUi.setup(specs, {
 customCss: ".swagger-ui .topbar { display: none }",
 customSiteTitle: "API Gestionnaire de Projets - Documentation",
 customfavIcon: "/favicon.ico",
 })
 );

 // Routes
 app.use("/auth", authRoutes);
 app.use("/projects", projectRoutes);
 app.use("/dashboard", dashboardRoutes);
 app.use(oauthRoutes);

 app.get("/users/search", authenticateToken as any, searchUsers);
 app.get("/users", authenticateToken as any, getAllUsers);

 app.get("/health", (req, res) => {
 res.status(200).json({
 success: true,
 message: "API en ligne",
 timestamp: new Date().toISOString(),
 environment: process.env.NODE_ENV || "development",
 });
 });

 app.get("/", (req, res) => {
 res.status(200).json({
 success: true,
 message: "API REST avec authentification et gestion de projets",
 version: "1.0.0",
 endpoints: {
 auth: {
 register: "POST /auth/register",
 login: "POST /auth/login",
 profile: "GET /auth/profile",
 updateProfile: "PUT /auth/profile",
 updatePassword: "PUT /auth/password",
 },
 projects: {
 create: "POST /projects",
 getAll: "GET /projects",
 getOne: "GET /projects/:id",
 update: "PUT /projects/:id",
 delete: "DELETE /projects/:id",
 addContributor: "POST /projects/:id/contributors",
 removeContributor: "DELETE /projects/:id/contributors/:userId",
 },
 tasks: {
 create: "POST /projects/:projectId/tasks",
 getAll: "GET /projects/:projectId/tasks",
 getOne: "GET /projects/:projectId/tasks/:taskId",
 update: "PUT /projects/:projectId/tasks/:taskId",
 delete: "DELETE /projects/:projectId/tasks/:taskId",
 },
 comments: {
 create: "POST /projects/:projectId/tasks/:taskId/comments",
 getAll: "GET /projects/:projectId/tasks/:taskId/comments",
 getOne: "GET /projects/:projectId/tasks/:taskId/comments/:commentId",
 update: "PUT /projects/:projectId/tasks/:taskId/comments/:commentId",
 delete: "DELETE /projects/:projectId/tasks/:taskId/comments/:commentId",
 },
 health: "GET /health",
 },
 });
 });

 // 404
 app.use("*", (req, res) => {
 res.status(404).json({
 success: false,
 message: "Route non trouvée",
 error: "NOT_FOUND",
 });
 });

 // Erreur globale
 app.use(
 (
 error: any,
 req: express.Request,
 res: express.Response,
 next: express.NextFunction) => {
 console.error("Erreur serveur:", error);
 res.status(500).json({
 success: false,
 message: "Erreur interne du serveur",
 error:
 process.env.NODE_ENV === "development"
 ? error?.message
 : "Internal server error",
 });
 }
 );
console.log("[APP] app initialisée");
 return app;
};