import { Router } from 'express';


const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
  //console.log(req.body.cityName)
  try {
    const data = await WeatherService.getWeatherForCity(req.body.cityName)
    console.log(data)
    res.send(data)
    // TODO: save city to search history
    HistoryService.addCity(req.body.cityName)
  } catch (e: any) {
    res.status(400).send({error: 'city name does not exist'})
  }
});

// TODO: GET search history
router.get('/history', async (req, res) => {
  const history = await HistoryService.getCities()
  res.send(history)
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const id = req.params.id
  try {
  const response = await HistoryService.removeCity(id)
  res.send({success: 'city deleted successfully'})
  } catch (e: any) {
    res.status(400).send({error: 'Id not found'})
  }
});

export default router;
