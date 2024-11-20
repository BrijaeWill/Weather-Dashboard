import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates{
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather{
temperature: number;
description: string;
humidty: number;
wind: number;
// constructor
constructor(
  temperature:number, 
  description: string,
   humidty: number, 
   wind: number) {
  
  this.temperature = temperature;
  this.description = description;
  this.humidty = humidty;
  this.wind = wind;  
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  //  Define the baseURL, API key, and city name properties
  private baseURL: string = 'https:api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}'
  private apiKey: string = '36ade06f1ca155fbd0b7dc5305fdd069';

  
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
  const url = this.buildGeocodeQuery(query);
  return  this.fetchData(url);
  }
  // TODO: Create destructureLocationData method
   private destructureLocationData(locationData: any): Coordinates {
    return{
      lat: locationData[0].lat,
      lon: locationData[0].lon,
    };
   }
   //Fetchdata method
   private async fetchData(url: string): Promise<any>{
    const response = await fetch(url);
    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
   }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(query: string):Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const url = this.buildWeatherQuery(coordinates);
    return this.fetchData(url);
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const currentWeather = response.list[0];
    return new Weather(currentWeather.main.temp,currentWeather[0].description,currentWeather.main.humidty,currentWeather.main.wind);
  }
  // TODO: Complete buildForecastArray method
   private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArray=weatherData.map(data => new Weather(data.main.temp,data.weather[0].description,data.main.humidty,data.main.wind));
    return [currentWeather,...forecastArray];
   }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    return this.buildForecastArray(currentWeather,weatherData.list);
  }  
        
}

export default new WeatherService();
