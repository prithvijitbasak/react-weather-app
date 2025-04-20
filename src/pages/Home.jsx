import { useState, useEffect } from "react";
import "../assets/styles/Home.css";
import logo from "../assets/images/logo-updated.jpg";
import cloudy from "../assets/images/Cloudy.png";
import tempMax from "../assets/images/temp max.png";
import tempMin from "../assets/images/temp min.png";
import humidity from "../assets/images/humidity.png";
import cloudyDetails from "../assets/images/cloudy details.png";
import wind from "../assets/images/wind.png";
import search from "../assets/images/fa_search.png";
import countryList from "../assets/json/countryCodes.json";
import Footer from "../components/Footer";

const Home = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);

  const API_URL = import.meta.env.VITE_SECRET_API_URL;
  const API_KEY = import.meta.env.VITE_SECRET_API_KEY;

  // Default city to load when component mounts
  const DEFAULT_CITY = "Kolkata";

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error(
          `City not found or API error. Status: ${response.status}`
        );
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(DEFAULT_CITY);
  }, []);

  const handleSearch = (e) => {
    if (!e || (e && e.key === "Enter")) {
      const searchCity = city.trim() === "" ? DEFAULT_CITY : city.trim();
      fetchWeather(searchCity);
    }
  };

  // Celsius to Fahrenheit converter
  const convertToFahrenheit = (tempInCelsius) =>
    (tempInCelsius * 9) / 5 + 32;

  // Return temperature based on current unit
  const getDisplayedTemp = (temp) =>
    isCelsius ? Math.round(temp) : Math.round(convertToFahrenheit(temp));

  // Toggle Celsius/Fahrenheit
  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  // Convert country code to country name
  const getCountryName = (code) => {
    const country = countryList.find((item) => item.countryCode === code);
    return country ? country.countryName : code;
  };

  return (
    <>
      <section className="pb-weather-app-wrapper">
        <div className="pb-container">
          <div className="pb-weather-app-contents">
            <div className="logo-search-bar-div">
              <a href="/" className="logo-anchor-tag">
                <img src={logo} alt="logo" />
              </a>
              <div className="input-div">
                <input
                  type="text"
                  placeholder="Search City..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => handleSearch(e)}
                />
                <img
                  src={search}
                  alt="search icon"
                  className="search-icon"
                  onClick={() => handleSearch()}
                />
              </div>
            </div>
            <div className="loading-location-div">
              {loading && <p className="green-text">Loading...</p>}
              {error && (
                <div className="red-text">
                  <p>Error: {error}</p>
                  <p>Here is the weather of last city entered!!!!</p>
                </div>
              )}
            </div>
            <div className="location-and-details-div">
              {weatherData && (
                <>
                  <div className="loc-temp-date">
                    <span className="temperature">
                      {(getDisplayedTemp(weatherData.main.temp) * 10) / 10}°
                    </span>
                    <div className="city-date-img">
                      <div className="city-date">
                        <h1>{weatherData.name}</h1>
                        <p>
                          {new Date(weatherData.dt * 1000).toLocaleTimeString(
                            "en-GB",
                            { hour: "2-digit", minute: "2-digit" }
                          )}{" "}
                          -{" "}
                          {new Date(weatherData.dt * 1000).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </p>
                        <p>{getCountryName(weatherData.sys.country)}</p>
                      </div>
                      <img
                        src={cloudy}
                        alt={weatherData.weather[0].description}
                      />
                    </div>
                  </div>
                  <div className="loc-details-div">
                    <div className="cel-fah-btn">
                      <button onClick={toggleTemperatureUnit}>
                        {isCelsius ? "F°" : "C°"}
                      </button>
                    </div>
                    <h4>Weather Details......</h4>
                    <div className="extra-details">
                      <h3>{weatherData.weather[0].description}</h3>
                      <div className="extra-details-row">
                        <p>Temp max</p>
                        <div className="number-and-logo">
                          <span>
                            {getDisplayedTemp(weatherData.main.temp_max)}°
                          </span>
                          <img src={tempMax} alt="Maximum temperature" />
                        </div>
                      </div>
                      <div className="extra-details-row">
                        <p>Temp min</p>
                        <div className="number-and-logo">
                          <span>
                            {getDisplayedTemp(weatherData.main.temp_min)}°
                          </span>
                          <img src={tempMin} alt="Minimum temperature" />
                        </div>
                      </div>
                      <div className="extra-details-row">
                        <p>Humidity</p>
                        <div className="number-and-logo">
                          <span>{weatherData.main.humidity}%</span>
                          <img src={humidity} alt="Humidity" />
                        </div>
                      </div>
                      <div className="extra-details-row">
                        <p>Cloudy</p>
                        <div className="number-and-logo">
                          <span>{weatherData.clouds.all}%</span>
                          <img src={cloudyDetails} alt="Cloudy" />
                        </div>
                      </div>
                      <div className="extra-details-row">
                        <p>Wind</p>
                        <div className="number-and-logo">
                          <span>
                            {Math.round(weatherData.wind.speed * 3.6)} Km/hr
                          </span>
                          <img src={wind} alt="Wind" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
