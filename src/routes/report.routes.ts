import { Router } from "express";
import { authMiddleware, type AuthenticatedRequest } from "../middleware/auth.js";
import { reportService } from "../services/report.service.js";

const router = Router();

router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    const period = (req.query.period as string) || "this_month";
    const result = await reportService.getSummary(userId, period);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch report summary" });
  }
});

router.get("/expense-breakdown", authMiddleware, async (req, res) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    const period = (req.query.period as string) || "this_month";
    const result = await reportService.getExpenseBreakdown(userId, period);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expense breakdown" });
  }
});

router.get("/monthly-comparison", authMiddleware, async (req, res) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    const months = Number(req.query.months) || 5;
    const result = await reportService.getMonthlyComparison(userId, months);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch monthly comparison" });
  }
});

router.get("/large-transactions", authMiddleware, async (req, res) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    const period = (req.query.period as string) || "this_month";
    const limit = Number(req.query.limit) || 5;
    const result = await reportService.getLargeTransactions(userId, period, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch large transactions" });
  }
});

export default router;
