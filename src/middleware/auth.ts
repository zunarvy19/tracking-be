import type { Request, Response, NextFunction } from "express";
import { auth } from "../auth/index.js";
import { fromNodeHeaders } from "better-auth/node";

export interface AuthenticatedRequest extends Request {
  userId: string;
  userSession: {
    session: { id: string; userId: string };
    user: { id: string; name: string; email: string; role?: string | null };
  };
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    (req as AuthenticatedRequest).userId = session.user.id;
    (req as AuthenticatedRequest).userSession = session as unknown as AuthenticatedRequest["userSession"];
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
