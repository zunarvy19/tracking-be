import { Router } from "express";
import { authMiddleware, type AuthenticatedRequest } from "../middleware/auth.js";
import { transactionService } from "../services/transaction.service.js";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    const filters = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      category: req.query.category as string,
      status: req.query.status as string,
      type: req.query.type as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    };
    const result = await transactionService.list(userId, filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

router.get("/export/csv", authMiddleware, async (req, res) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    const filters = {
      category: req.query.category as string,
      status: req.query.status as string,
      type: req.query.type as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    };
    const csv = await transactionService.exportCsv(userId, filters);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=transactions.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: "Failed to export transactions" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    const result = await transactionService.getById(userId, req.params.id as string);
    if (!result) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    const result = await transactionService.create(userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    const result = await transactionService.update(userId, req.params.id as string, req.body);
    if (!result) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update transaction" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    const result = await transactionService.delete(userId, req.params.id as string);
    if (!result) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }
    res.json({ message: "Transaction deleted", data: result });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

export default router;
