import type { Request, Response, NextFunction } from "express";
export interface AuthenticatedRequest extends Request {
    userId: string;
    userSession: {
        session: {
            id: string;
            userId: string;
        };
        user: {
            id: string;
            name: string;
            email: string;
            role?: string | null;
        };
    };
}
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void>;
