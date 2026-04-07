import { auth } from "../auth/index.js";
import { fromNodeHeaders } from "better-auth/node";
export async function authMiddleware(req, res, next) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        if (!session) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        req.userId = session.user.id;
        req.userSession = session;
        next();
    }
    catch {
        res.status(401).json({ error: "Unauthorized" });
    }
}
