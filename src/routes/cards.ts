import {
  dislikeCard,
  getCards,
  likeCard,
  postCard,
} from "../controllers/cards";
import { Router } from "express";

const router = Router();
router.get("/", getCards);
router.post("/", postCard);
router.put("/:cardId/likes", likeCard);
router.delete("/:cardId/likes", dislikeCard);

export default router;
