import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { dashboardService } from "../services/dashboard.service.js";
const router = Router();
router.get("/stats", authMiddleware, async (req, res) => {
    try {
        const { userId } = req;
        const result = await dashboardService.getStats(userId);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
});
router.get("/recent-transactions", authMiddleware, async (req, res) => {
    try {
        const { userId } = req;
        const limit = Number(req.query.limit) || 5;
        const result = await dashboardService.getRecentTransactions(userId, limit);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch recent transactions" });
    }
});
export default router;
