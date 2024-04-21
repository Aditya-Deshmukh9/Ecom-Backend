import express from "express";
import userRouter from "./user/userRouter";
import cors from "cors";
import { config } from "./config/config";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: config.frontend_domain,
  })
);

app.get("/", (req, res) => {
  res.json("Home page!");
});

app.use("/api/users", userRouter);

app.use(globalErrorHandler);

export default app;
