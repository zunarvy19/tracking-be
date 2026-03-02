import { Router } from "express";
import { authMiddleware, type AuthenticatedRequest } from "../middleware/auth.js";
import { categoryService } from "../services/category.service.js";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { user } = (req as AuthenticatedRequest).userSession;
    const result = await categoryService.list(user);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { user } = (req as AuthenticatedRequest).userSession;
    const result = await categoryService.create(user, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { user } = (req as AuthenticatedRequest).userSession;
    const result = await categoryService.update(user, req.params.id as string, req.body);
    if (!result) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { user } = (req as AuthenticatedRequest).userSession;
    const result = await categoryService.delete(user, req.params.id as string);
    if (!result) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json({ message: "Category deleted", data: result });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;
