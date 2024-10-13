import express from 'express';
import { getWeatherForecast } from '../services/weatherService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { location } = req.query;
  const weather = await getWeatherForecast(location);
  res.json(weather);
});

export default router;
