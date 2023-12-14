import { Router } from "express";
import auth from "../middlewares/auth";
import {
  editUser,
  editUserAvatar,
  getCurrent,
  getUser,
  getUsers,
} from "../controllers/users";
import { celebrate, Joi, Segments } from "celebrate";
import { isUrlAvatar } from "../helpers/validation/link-check";

const hexValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

export const createValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(isUrlAvatar),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

export const loginValidation = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    })
    .unknown(true),
});

const editUserValidation = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(200).required(),
    })
    .unknown(true),
});

const editAvatarValidation = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      avatar: Joi.string().pattern(isUrlAvatar).required(),
    })
    .unknown(true),
});

const router = Router();

router.use(auth);
router.get("/", getUsers);
router.get("/me", getCurrent);
router.patch("/me/avatar", editAvatarValidation, editUserAvatar);
router.patch("/me", editUserValidation, editUser);
router.get("/:userId", hexValidation, getUser);

export default router;
