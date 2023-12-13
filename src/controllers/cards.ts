import { NextFunction, Request, Response } from "express";
import Card, { ICard } from "../models/card";
import ApiError from "../helpers/types/error";

export interface IRequest extends Request {
  user?: { _id: string };
}
export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

type CardRequest = TypedRequestBody<ICard>;

export const getCards = (
  req: CardRequest,
  res: Response,
  next: NextFunction
) => {
  Card.find({})
    .populate("owner", { name: 1, about: 1, avatar: 1 })
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

export const postCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  console.log(req.body);
  const userId = req.body.user._id;
  Card.create({ name: name, link: link, owner: userId, likes: [] })
    .then((card) => res.send(card))
    .catch((err) =>
      next(ApiError.InvalidInputError("Введены некорректные данные", err))
    );
};
export const deleteCard = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .populate("owner")
    .then((card) => {
      if (!card) return next(ApiError.NotFoundError());
      if (card.owner._id.toString() !== req.body.user?._id)
        return next(ApiError.ForbiddenError());
      card.deleteOne().then((cardId) => res.send(cardId));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(ApiError.InvalidInputError());
      } else next(err);
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.body.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((card) => {
      if (!card) return next(ApiError.NotFoundError());
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(ApiError.NotFoundError());
      } else next(err);
    });
};

export const dislikeCard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cardId } = req.params;
  const userId = req.body.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) return next(ApiError.NotFoundError());
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(ApiError.NotFoundError());
      } else next(err);
    });
};
