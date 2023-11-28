import { Router } from 'express';
import {
  createUser,
  editUser,
  editUserAvatar,
  getUser,
  getUsers,
  login,
} from '../controllers/users';

const router = Router();
router.get('/', getUsers);

router.post('/', createUser);

router.get('/:userId', getUser);
router.post('/login', login);

router.patch('/me/avatar', editUserAvatar);

router.patch('/me', editUser);

export default router;
