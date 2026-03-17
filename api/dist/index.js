import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
const app = express();
const port = 3001;
const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://ericzuo.ca",
        "https://www.ericzuo.ca",
    ],
}));
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