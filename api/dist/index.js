import express from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma/client.js";
const app = express();
const port = 3001;
const prisma = new PrismaClient();
app.use(express.json());
app.use(cors());
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.post("/api/mailing-list", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ error: "email is required" });
        return;
    }
    const entry = await prisma.mailingList.create({ data: { email } });
    res.status(201).json(entry);
});
app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map