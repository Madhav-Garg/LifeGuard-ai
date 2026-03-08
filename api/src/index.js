import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "lifeguard-api", time: new Date().toISOString() });
});

app.post("/auth/login", (_req, res) => {
  // TODO: implement JWT login
  res.json({ token: "mock-token" });
});

app.post("/predict", (_req, res) => {
  // TODO: call ai-service FastAPI
  res.json({ risk: { heartDisease: 0.12, diabetes: 0.08, stress: 0.2 } });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
