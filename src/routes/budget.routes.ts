import { Router } from "express";
import { authMiddleware, type AuthenticatedRequest } from "../middleware/auth.js";
import { budgetService } from "../services/budget.service.js";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    const result = await budgetService.list(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});

router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    const result = await budgetService.getSummary(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch budget summary" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    const result = await budgetService.create(userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create budget" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    const result = await budgetService.update(userId, req.params.id as string, req.body);
    if (!result) {
      res.status(404).json({ error: "Budget not found" });
      return;
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update budget" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    const result = await budgetService.delete(userId, req.params.id as string);
    if (!result) {
      res.status(404).json({ error: "Budget not found" });
      return;
    }
    res.json({ message: "Budget deleted", data: result });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete budget" });
  }
});

export default router;
