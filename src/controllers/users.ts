import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/user";
import jwt from "jsonwebtoken";

import ApiError from "../helpers/types/error";

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

export type UserRequest = TypedRequestBody<IUser>;

export const createUser = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, name, about, avatar, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email: email,
        name: name,
        about: about,
        avatar: avatar,
        password: hash,
      })
        .then((user) =>
          res.send({
            _id: user._id,
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          })
        )
        .catch((err) => {
          if (err.name === "ValidationError") {
            next(
              ApiError.InvalidInputError("Введены некорректные данные", err)
            );
          } else if (err.code === 11000) {
            next(ApiError.ConflictUserError());
          } else {
            next(err);
          }
        })
    )
    .catch((err) => {
      next(err);
    });
};

export const getUsers = (req: Request, res: Response, next: NextFunction) =>
  User.find({ name: { $exists: true } }, { name: 1, about: 1, avatar: 1 })
    .then((users) => res.send(users))
    .catch((err) => {
      next(err);
    });

export const getUser = (req: Request, res: Response, next: NextFunction) =>
  User.findOne({ _id: req.params.userId }, { name: 1, about: 1, avatar: 1 })
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === "CastError") {
        next(ApiError.NotFoundError());
      } else next(err);
    });

export const editUser = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  User.findByIdAndUpdate(
    req.body.user._id,
    { name: req.body.name, about: req.body.about },
    { fields: { name: 1, about: 1 }, new: true }
  )
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(ApiError.NotFoundError());
      } else next(err);
    });
};

export const editUserAvatar = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  User.findByIdAndUpdate(
    req.body.user._id,
    { avatar: req.body.avatar },
    { fields: { avatar: 1 }, new: true }
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        next(ApiError.NotFoundError());
      } else next(err);
    });
};

export const login = (req: UserRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "super-strong-secret");
      res.send(token);
    })
    .catch((err) => {
      next(ApiError.InvalidLoginError());
    });
};
