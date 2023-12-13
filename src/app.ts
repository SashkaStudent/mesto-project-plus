import express from "express";
import error from "./middlewares/error";
import mongoose from "mongoose";
import notFoundRoute from "./routes/not-found";
import cardsRoutes from "./routes/cards";
import usersRoutes from "./routes/users";
import { errors } from "celebrate";

const { PORT = 3000, MONGO_URL = "mongodb://localhost:27017/mydb" } =
  process.env;
mongoose.connect(MONGO_URL);

const app = express();

app.use(express.json());

app.use("/users", usersRoutes);
app.use("/cards", cardsRoutes);
app.use("*", notFoundRoute);

app.use(errors());
app.use(error);
app.listen(PORT, () => {
  console.log("Here we go again");
});
