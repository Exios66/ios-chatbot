import express from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await getUsers();
  res.render('users', { title: 'User Management', users });
});

router.post('/', async (req, res) => {
  const newUser = await createUser(req.body);
  res.status(201).json(newUser);
});

router.put('/:id', async (req, res) => {
  const updatedUser = await updateUser(req.params.id, req.body);
  res.json(updatedUser);
});

router.delete('/:id', async (req, res) => {
  await deleteUser(req.params.id);
  res.status(204).end();
});

export default router;
