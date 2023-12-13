import { Router } from "express";
import auth from "../middlewares/auth";
import {
  createUser,
  editUser,
  editUserAvatar,
  getUser,
  getUsers,
  login,
} from "../controllers/users";
import { celebrate, Joi, Segments } from "celebrate";
import { isUrlAvatar } from "../helpers/validation/link-check";

const hexValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const createValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(isUrlAvatar),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const loginValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const editUserValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
});

const editAvatarValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().pattern(isUrlAvatar).required(),
  }),
});

const router = Router();

router.get("/", getUsers);

router.post("/", createValidation, createUser);

router.get("/:userId", hexValidation, getUser);
router.post("/login", loginValidation, login);
router.use(auth);
router.patch("/me/avatar", editAvatarValidation, editUserAvatar);
router.patch("/me", editUserValidation, editUser);
export default router;
