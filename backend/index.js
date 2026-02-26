import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import map_router from "./routes/map_route.js";

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

app.use("/api",map_router);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`✅ Metadata uploader running at http://localhost:${port}`);
});



