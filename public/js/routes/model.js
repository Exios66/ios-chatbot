import express from 'express';
import { getModels, selectModel } from '../services/modelService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const models = await getModels();
  res.render('modelSelection', { title: 'Model Selection', models });
});

router.post('/select', async (req, res) => {
  const { modelId } = req.body;
  const selectedModel = await selectModel(req.user.id, modelId);
  res.json(selectedModel);
});

export default router;