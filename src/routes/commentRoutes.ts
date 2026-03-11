import { Router } from "express";
import {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken as any);

// Routes pour les commentaires
router.post("/", createComment);
router.get("/", getComments);
router.get("/:commentId", getComment);
router.put("/:commentId", updateComment);
router.delete("/:commentId", deleteComment);

export default router;
