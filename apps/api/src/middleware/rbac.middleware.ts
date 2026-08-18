import type { Request, Response, NextFunction } from "express";
import { AuthorizationService } from "../lib/authorization-service";

export function requirePermission(
  relation: string,
  objectType: "organization" | "workspace"
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const objectId = req.params.workspaceId ?? req.params.orgId;
    const allowed = await AuthorizationService.can(
      req.user.id,
      relation,
      objectType,
      objectId as string
    );
    if (!allowed) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}