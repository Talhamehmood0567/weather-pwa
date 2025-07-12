const API_KEY = "YOUR_API_KEY"; // Replace with actual API key

export const fetchWeatherByCoords = async (lat, lon) => {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
};
