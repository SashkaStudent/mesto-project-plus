import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/user';
import {
  DEFAULT_ERROR,
  INVALID_INPUT,
  NOT_FOUND,
} from '../helpers/error-codes';
import { castError, defaultError, inputError } from '../helpers/error-messaging';

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

type UserRequest = TypedRequestBody<IUser>;

export const createUser = (req: UserRequest, res: Response) => {
  const { name, about, avatar, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name: name,
        about: about,
        avatar: avatar,
        password: hash,
      })
        .then((user) =>
          res.send({
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          })
        )
        .catch((err) => {
          res.status(INVALID_INPUT).send(inputError(err));
        })
    )
    .catch((err) => {
      res.status(INVALID_INPUT).send(inputError(err));
    });
};

export const getUsers = (req: Request, res: Response) =>
  User.find({ name: { $exists: true } }, { name: 1, about: 1, avatar: 1 })
    .then((users) => res.send(users))
    .catch((err) => {
      res.status(INVALID_INPUT).send(inputError(err));
    });

export const getUser = (req: Request, res: Response) =>
  User.findOne({ _id: req.params.userId }, { name: 1, about: 1, avatar: 1 })
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send(castError(err));
      } else res.status(DEFAULT_ERROR).send(defaultError(err));
    });

export const editUser = (req: Request, res: Response) => {
  console.log(req.body);

  User.findByIdAndUpdate(
    req.body.user._id,
    { name: req.body.name, about: req.body.about },
    { fields: { name: 1, about: 1 }, new: true }
  )
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send(castError(err));
      } else res.status(DEFAULT_ERROR).send(defaultError(err));
    });
};

export const editUserAvatar = (req: Request, res: Response) => {
  console.log(req.body);
  User.findByIdAndUpdate(
    req.body.user._id,
    { avatar: req.body.avatar },
    { fields: { avatar: 1 }, new: true }
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send(castError(err));
      } else res.status(DEFAULT_ERROR).send(defaultError(err));
    });
};

export const login = (req: UserRequest, res: Response) => {
  const { name, password } = req.body;

  return User.findUserByCredentials(name, password)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
