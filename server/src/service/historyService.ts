
const fs = require('fs').promises; 
import { v4 as uuidv4 } from 'uuid'; 
// City class
class City{
  name: string;
  id: string;
  constructor(name:string){
  this.name = name;
  this.id = uuidv4();

  }
}


// TODO: Complete the HistoryService class
class HistoryService {
  private filePath: string;
  constructor(){
    this.filePath='server/db/searchHistory.json'
  }
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try{
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
      }catch(error){
        console.error('Error reading the file:',error);
        return [];
      }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
try{
await fs.writeFile(this.filePath,JSON.stringify(cities,null,2));
} catch(error){
  console.error('Error writing to the file:',error);
}
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    const cities = await this.read();
    return cities.map(city => new City(city.name));
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<City> {
    const cities = await this.read();
    const newCity = new City(cityName);
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id!==id);
    await this.write(cities);
  }
}

export default new HistoryService();
