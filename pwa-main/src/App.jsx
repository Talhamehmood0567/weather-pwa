import React, { useState, useEffect } from "react";
import { fetchWeather } from "./api/fetchWeather";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState(null);

  // New state to check loading
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const geoRes = await fetch(`https://api.weatherapi.com/v1/current.json?key=b0a7bad410d5400c8c3145734251107&q=${latitude},${longitude}`);
            const data = await geoRes.json();
            setWeatherData(data);
            setCityName(data.location.name);
            setLoading(false);
          } catch (err) {
            setError("Failed to fetch location-based weather.");
            setLoading(false);
          }
        },
        (error) => {
          console.error(error);
          setError("Location permission denied.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleSearch = async () => {
    try {
      const data = await fetchWeather(cityName);
      setWeatherData(data);
    } catch (err) {
      setError("Could not fetch weather for the specified city.");
    }
  };

  return (
    <div>
      <h1>Weather App</h1>
      <input
        type="text"
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        placeholder="Enter city name"
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading local weather...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weatherData && (
        <div>
          <h2>{weatherData.location.name}</h2>
          <p>{weatherData.current.temp_c}°C</p>
          <p>{weatherData.current.condition.text}</p>
        </div>
      )}
    </div>
  );
};

export default App;
import { messaging, getToken } from "./firebase/firebase";

useEffect(() => {
  // Request notification permission
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      getToken(messaging, { vapidKey: "YOUR_VAPID_KEY_HERE" })
        .then((token) => {
          console.log("FCM Token:", token);
          // Save token to backend if needed
        })
        .catch((err) => console.error("Token Error:", err));
    }
  });
}, []);
