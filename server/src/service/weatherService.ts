import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

interface Weather {
  tempF: string,
  icon: string,
  date: any,
  iconDescription: string,
  windSpeed: string,
  humidity: string
}

// TODO: Define a class for the Weather object

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}

  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL;
    this.apiKey = process.env.API_KEY;
  }

  // Method to fetch location data based on the city name
  private async fetchLocationData(query: string) {
    const url = this.buildGeocodeQuery();
    const response = await axios.get(url);
    const data = await response.data;
    return data;
  }

  // Method to destructure and get coordinates from the location data
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon
    };
  }

  // Method to build the geocode query
  private buildGeocodeQuery(): string {
    console.log(`${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`)
    return encodeURI(`${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`);
  }

  // Method to build the weather query using coordinates
  private buildWeatherQuery(coordinates: Coordinates): string {
    //console.log(`${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`)
    return encodeURI(`${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`);
  }

  // Method to fetch and destructure location data
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.cityName);
    return this.destructureLocationData(locationData);
  }

  // Method to fetch weather data based on coordinates
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await axios.get(weatherQuery);
    const data = response.data;
    return data;
  }

  // Method to parse the current weather from the response
  private parseCurrentWeather(response: any) {
    return {
      tempF: response.main.temp,
      description: response.weather[0].description,
      icon: response.weather[0].icon,
      date: new Date(response.dt * 1000).toISOString().split('T')[0],
      iconDescription: response.weather[0].description,
      windSpeed: response.wind.speed,
      humidity: response.main.humidity,
      city: this.cityName
    };
  }

  // Method to build an array of forecast data
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray: Weather[] = [];
    const daysIncluded = new Set<string>();
    daysIncluded.add(currentWeather.date)

    for (const forecast of weatherData) {
      // Convert the Unix timestamp to a date string (e.g., "YYYY-MM-DD")
      const date = new Date(forecast.dt * 1000).toISOString().split('T')[0];

      // If the day is not already included, add it to the result
      if (!daysIncluded.has(date)) {
        forecastArray.push({
          tempF: forecast.main.temp,
          icon: forecast.weather[0].icon,
          date: new Date(forecast.dt * 1000).toISOString().split('T')[0],
          iconDescription: forecast.weather[0].description,
          windSpeed: forecast.wind.speed,
          humidity: forecast.main.humidity
        });
        daysIncluded.add(date);

        // Stop when we've added 5 days
        if (forecastArray.length === 5) {
          break;
        }
      }
    }

    return forecastArray
  }

  // Method to get weather data for a given city
  async getWeatherForCity(city: string) {
    this.cityName = city; // Set city name for the service
    try {
      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherData = await this.fetchWeatherData(coordinates);
      //console.log(weatherData)
      const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
      const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
      /*
      // Assuming you want to get the forecast as well (replace with your actual API call to fetch forecast data)
      const forecastData = await axios.get(`${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`);
      const forecastResponse = forecastData.data;
      const forecastArray = this.buildForecastArray(currentWeather, forecastResponse.list);
      */

      return [currentWeather, ...forecastArray];

    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Unable to fetch weather data');
    }
  }
}

export default new WeatherService();
