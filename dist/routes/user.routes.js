import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { userService } from "../services/user.service.js";
const router = Router();
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const { userId } = req;
        const result = await userService.getProfile(userId);
        if (!result) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});
router.put("/me", authMiddleware, async (req, res) => {
    try {
        const { userId } = req;
        const result = await userService.updateProfile(userId, req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update profile" });
    }
});
router.delete("/me", authMiddleware, async (req, res) => {
    try {
        const { userId } = req;
        const result = await userService.deleteAccount(userId);
        if (!result) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json({ message: "Account deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete account" });
    }
});
export default router;
