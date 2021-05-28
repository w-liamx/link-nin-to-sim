import express from "express";
import logger from "morgan";
import cors from "cors";

import appRoutes from "./routes/base.js";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use("/api", appRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the NIN to SIM linking portal...");
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
