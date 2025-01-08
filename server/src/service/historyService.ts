import { v4 as uuidv4 } from "uuid"
import { promises as fs } from "fs";

import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Define a City class with name and id properties      
class City {
  name: string;
  id: string;

  constructor (name: string) {
    this.name = name
    this.id = uuidv4()
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private filePath = path.join(__dirname, '../../db/db.json');
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) || [];
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return an empty array
        return [];
      }
      throw new Error(`Error reading file: ${error.message}`);
    }

  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (error: any) {
      throw new Error(`Error writing to file: ${error.message}`);
    }

  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const rawCities = await this.read();
    return rawCities;
  }
    
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = await this.read(); // Fetch the current list of cities
    if (cities.filter((cc: City) => cc.name === city).length > 0) return
    const newCity = new City(city); // Create a new City instance
    cities.push(newCity); // Add the new city to the array
    await this.write(cities); // Write the updated array back to the file
  }
    
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.read(); // Fetch the current list of cities
    const updatedCities = cities.filter((city: City) => city.id !== id); // Filter out the city with the given ID
    if (updatedCities.length === cities.length) {
      throw new Error(`City with ID ${id} not found.`);
    }
    await this.write(updatedCities); // Write the updated array back to the file
  }
}

export default new HistoryService();
