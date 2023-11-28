import { Request, Response } from "express";
import { INVALID_INPUT } from "../helpers/error-codes";
import Card, { ICard } from "../models/card";

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

type CardRequest = TypedRequestBody<ICard>;

export const getCards = (req: CardRequest, res: Response) => {
  Card.find({})
    .populate("owner", { name: 1, about: 1, avatar: 1 })
    .then((cards) => res.send(cards))
    .catch((err) => res.status(INVALID_INPUT).send(err));
};

export const postCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const userId = req.body.user._id;
  Card.create({ name: name, link: link, owner: userId, likes: [] })
    .then((card) => res.send(card))
    .catch((err) => res.status(INVALID_INPUT).send(err));
};

export const likeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = req.body.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((card) => res.send(card))
    .catch((err) => res.status(INVALID_INPUT).send(err));
};

export const dislikeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = req.body.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => res.status(INVALID_INPUT).send(err));
};
