import express, { type Request, type Response, type NextFunction } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./modules/auth/auth.config";
const PORT = process.env.PORT ?? 4000;

export const app = express();

app.all("/api/auth/", toNodeHandler(auth));

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`);
});
