import { useEffect, useState } from "react";
import api from "../services/api";

// Shows current weather for the trip's destination city
const WeatherWidget = ({ city }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/weather/${encodeURIComponent(city)}`);
        setWeather(data);
        setError("");
      } catch (err) {
        setError("Could not load weather for this destination.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  if (loading) {
    return <div className="card font-body text-sm text-taupe">Loading weather...</div>;
  }

  if (error) {
    return <div className="card font-body text-sm text-rust">{error}</div>;
  }

  if (!weather) return null;

  return (
    <div className="card">
      <h4 className="font-display text-lg text-ink mb-3">Current Weather in {weather.city}</h4>
      <div className="grid grid-cols-2 gap-3 font-body text-sm">
        <div>
          <p className="text-taupe">Temperature</p>
          <p className="text-ink font-semibold text-lg">{Math.round(weather.temperature)}°C</p>
        </div>
        <div>
          <p className="text-taupe">Condition</p>
          <p className="text-ink font-semibold capitalize">{weather.condition}</p>
        </div>
        <div>
          <p className="text-taupe">Humidity</p>
          <p className="text-ink font-semibold">{weather.humidity}%</p>
        </div>
        <div>
          <p className="text-taupe">Wind Speed</p>
          <p className="text-ink font-semibold">{weather.windSpeed} m/s</p>
        </div>
      </div>

      {weather.suggestion && (
        <p className="mt-3 text-sm font-body text-sage bg-sage/10 rounded-md px-3 py-2">
          {weather.suggestion}
        </p>
      )}
    </div>
  );
};

export default WeatherWidget;
