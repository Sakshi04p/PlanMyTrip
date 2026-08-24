import axios from "axios";

// @desc    Get current weather for a city
// @route   GET /api/weather/:city
// @access  Private
export const getWeather = async (req, res, next) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      res.status(500);
      throw new Error("OpenWeather API key is not configured on the server");
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    const data = response.data;

    // Simple suggestion when it's rainy - no automatic itinerary changes
    const isRainy = data.weather?.[0]?.main?.toLowerCase().includes("rain");

    res.json({
      city: data.name,
      temperature: data.main.temp,
      condition: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      suggestion: isRainy ? "Consider indoor activities today." : null,
    });
  } catch (error) {
    if (error.response?.status === 404) {
      res.status(404);
      next(new Error("City not found"));
    } else {
      next(error);
    }
  }
};
