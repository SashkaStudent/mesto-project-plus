import express from "express";
import error from "./middlewares/error";
import mongoose from "mongoose";
import notFoundRoute from "./routes/not-found";
import cardsRoutes from "./routes/cards";
import usersRoutes, { createValidation, loginValidation } from "./routes/users";
import { errors } from "celebrate";
import { requestLogger, errorLogger } from "./middlewares/logger";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createUser, login } from "./controllers/users";

dotenv.config();
const { PORT = 3000, MONGO_URL = "mongodb://localhost:27017/mydb" } =
  process.env;

mongoose.connect(MONGO_URL);

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(helmet());

app.use(express.json());

app.use(requestLogger);

app.post("/signin", createValidation, login);

app.post("/signup", loginValidation, createUser);

app.use("/users", usersRoutes);
app.use("/cards", cardsRoutes);
app.use("*", notFoundRoute);

app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log("Here we go again");
});
