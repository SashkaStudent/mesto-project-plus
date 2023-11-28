import express, { NextFunction, Response } from "express";
import mongoose from "mongoose";
import cardsRoutes from "./routes/cards";
import usersRoutes from "./routes/users";

const { PORT = 3000, BASE_PATH = "" } = process.env;

mongoose.connect("mongodb://localhost:27017/mydb");

const app = express();

type UserType = { _id: string };

type UserReqParams = {
  user: UserType;
};

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

type UserRequest = TypedRequestBody<UserReqParams>;

app.use(express.json());

app.use((req: UserRequest, res: Response, next: NextFunction) => {
  req.body.user = {
    _id: "656550e27c069a2b2ddc29a5",
  };

  next();
});

app.use("/users", usersRoutes);

app.use("/cards", cardsRoutes);

app.listen(PORT, () => {
  console.log("Here we go again");
});
