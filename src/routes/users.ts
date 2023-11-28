import {
  createUser,
  editUser,
  editUserAvatar,
  getUser,
  getUsers,
  login,
} from "../controllers/users";
import { Router } from "express";

const router = Router();
router.get("/", getUsers);

router.post("/", createUser);

router.get("/:userId", getUser);
router.post("/login", login);

router.patch("/me/avatar", editUserAvatar);

router.patch("/me", editUser);

export default router;
