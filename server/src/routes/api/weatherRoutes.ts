import { Router } from 'express';
const router = Router();


import WeatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
  const city = req.body.city;
  try{
    const weatherData = await WeatherService.getWeatherForCity(city);
    // TODO: save city to search history
    await historyService.addCity(city);
    res.status(200).json(weatherData);
  }catch (error) {
    console.error('Error fetching weather data:',error);
    res.status(500).json({ error: 'An error occurred while fetching weather data.' });
  }
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try{
    const searchHistory = await historyService.getCities();
    res.status(200).json(searchHistory);
  }catch (error){
    console.error('Error fetching search history:',error);
    res.status(500).json({error:'An error occured while fetching search history'})
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const cityId = req.params.id;
  try{
    await historyService.removeCity(cityId);
    res.status(204).send();
  }catch(error){
    console.error('Error deleting city from search history:', error);
    res.status(500).json({ error: 'An error occurred while deleting the city.' });
  }
});

export default router;
