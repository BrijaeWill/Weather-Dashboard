import dayjs from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates{
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather{
city:string;
date: dayjs.Dayjs;
icon: string;
iconDescription: string;
tempF: number;
windSpeed: number;
humidity: number;



// constructor
constructor(
  city:string,
  date: dayjs.Dayjs,
  icon:string,
  description: string, 
  tempF:number,
   windSpeed: number,
   humidity: number, 
  ) {

  this.city = city;
  this.date = date;
  this.icon = icon;
  this.iconDescription = description;
  this.tempF = tempF;
  this.windSpeed = windSpeed;
  this.humidity = humidity; 
  
  }
   getFormattedDate(format: string = 'MM/DD/YYYY'): string {
    return this.date.format(format);
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  //  Define the baseURL, API key, and city name properties
  private baseURL: string = 'https://api.openweathermap.org/'
  private apiKey: string = '36ade06f1ca155fbd0b7dc5305fdd069';

  
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
  const url = this.buildGeocodeQuery(query);
  if(!url){
    console.error("Error: URL could not be constructed from the query.") 
    return;
  }
  console.log("Constructed URL:", url);
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
    console.log(url);
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
    return `${this.baseURL}data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
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
    console.log(currentWeather);
    const date = dayjs(currentWeather.dt_txt);
    return new Weather(currentWeather.cityName,date,currentWeather.weather[0].icon,currentWeather.weather[0].description,currentWeather.main.temp,currentWeather.wind.speed,currentWeather.main.humidity);
  }
  // TODO: Complete buildForecastArray method
   private buildForecastArray(currentWeather: Weather,weatherData:any[]): Weather[] {
    console.log(weatherData)
    const forecastArray=weatherData.map(data => new Weather(data.cityName,data.date,data.weather[0].icon,data.weather[0].description,data.main.temp,data.
      
      
      
      
      
      
      
      wind.speed,data.main.humidity));
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
