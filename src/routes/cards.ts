import { Router } from "express";
import auth from "../middlewares/auth";
import {
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
  postCard,
} from "../controllers/cards";

import { celebrate, Segments, Joi } from "celebrate";
import { isUrlImg } from "../helpers/validation/link-check";

const hexValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const cardValidation = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().pattern(new RegExp(isUrlImg)).required(),
    })
    .unknown(true),
});

const router = Router();
router.get("/", getCards);
router.use(auth);
router.post("/", cardValidation, postCard);
router.put("/:cardId/likes", hexValidation, likeCard);
router.delete("/:cardId/likes", hexValidation, dislikeCard);
router.delete("/:cardId", hexValidation, deleteCard);

export default router;
