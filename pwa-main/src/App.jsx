import React, { useState, useEffect } from "react";
import { fetchWeather } from "./api/fetchWeather";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Geolocation + saved searches + push notification
  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(savedSearches);

    // Geolocation weather
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${latitude},${longitude}`
          );
          const data = await res.json();
          setWeatherData(data);
          updateRecentSearches(data.location.name);
        } catch (err) {
          console.error("Geo Error", err);
        }
      });
    }

    // Register Service Worker & Request Notification
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/serviceWorker.js").then((reg) => {
        console.log("SW registered", reg);
      });

      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          new Notification("Notifications enabled!", {
            body: "You’ll now receive weather alerts.",
          });
        }
      });
    }

    // Sync queued offline requests
    if (navigator.onLine) {
      const queued = JSON.parse(localStorage.getItem("offlineQueue") || "[]");
      queued.forEach(city => fetchData(city));
      localStorage.removeItem("offlineQueue");
    }
  }, []);

  const fetchData = async (city) => {
    if (!navigator.onLine) {
      queueOffline(city);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
      setCityName("");
      updateRecentSearches(data.location.name);
    } catch (error) {
      setError("City not found. Please try again.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const queueOffline = (city) => {
    const queued = JSON.parse(localStorage.getItem("offlineQueue") || "[]");
    queued.push(city);
    localStorage.setItem("offlineQueue", JSON.stringify(queued));

    if ("serviceWorker" in navigator && "SyncManager" in window) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.sync.register("sync-weather");
      });
    }

    alert("Offline! Your search will be sent once you’re online.");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchData(cityName);
    }
  };

  const updateRecentSearches = (city) => {
    const updated = [city, ...recentSearches.filter(c => c !== city)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleRecentSearch = (city) => {
    setCityName(city);
    fetchData(city);
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const getTemperature = () => {
    if (!weatherData) return "";
    return isCelsius
      ? `${weatherData.current.temp_c} °C`
      : `${weatherData.current.temp_f} °F`;
  };

  return (
    <div>
      <div className="app">
        <h1>Weather App</h1>
        <div className="search">
          <input
            type="text"
            placeholder="Enter city name..."
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>

        <div className="unit-toggle">
          <span>°C</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={!isCelsius}
              onChange={toggleTemperatureUnit}
            />
            <span className="slider round"></span>
          </label>
          <span>°F</span>
        </div>

        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}

        {weatherData && (
          <div className="weather-info">
            <h2>
              {weatherData.location.name}, {weatherData.location.region}, {weatherData.location.country}
            </h2>
            <p>Temperature: {getTemperature()}</p>
            <p>Condition: {weatherData.current.condition.text}</p>
            <img
              src={weatherData.current.condition.icon}
              alt={weatherData.current.condition.text}
            />
            <p>Humidity: {weatherData.current.humidity}%</p>
            <p>Pressure: {weatherData.current.pressure_mb} mb</p>
            <p>Visibility: {weatherData.current.vis_km} km</p>
          </div>
        )}

        {recentSearches.length > 0 && (
          <div className="recent-searches">
            <h3>Recent Searches</h3>
            <ul>
              {recentSearches.map((city, index) => (
                <li key={index} onClick={() => handleRecentSearch(city)}>
                  {city}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
const [city, setCity] = useState("");

const handleSearch = () => {
  if (!city) return;
  if (navigator.onLine) {
    // call API
  } else {
    const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
    queue.push(city);
    localStorage.setItem('offlineQueue', JSON.stringify(queue));
    navigator.serviceWorker.ready.then((reg) => {
      reg.sync.register('sync-weather');
    });
    alert("Offline! Your request is queued.");
  }
};
