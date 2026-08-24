import { GoogleGenAI } from "@google/genai";

let ai = null;

const getAiClient = () => {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      const error = new Error(
        "GEMINI_API_KEY is missing. Add it to backend/.env and restart the server."
      );
      error.statusCode = 500;
      throw error;
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
};

// Builds the prompt sent to Gemini based on the trip details
const buildPrompt = ({ destination, days, budget, travelers, interests, travelStyle }) => {
  return `You are a travel planning assistant. Create a day-wise travel itinerary.

Destination: ${destination}
Number of days: ${days}
Budget: ${budget}
Number of travelers: ${travelers}
Travel style: ${travelStyle || "Balanced"}
Interests: ${(interests || []).join(", ") || "General sightseeing"}

Return ONLY valid JSON (no markdown, no backticks, no extra text) in exactly this shape:
{
  "itinerary": [
    {
      "day": 1,
      "activities": [
        { "time": "Morning", "place": "Place name", "description": "Short description" },
        { "time": "Afternoon", "place": "Place name", "description": "Short description" },
        { "time": "Evening", "place": "Place name", "description": "Short description" }
      ]
    }
  ]
}`;
};

// @desc    Generate an AI itinerary using Gemini
// @route   POST /api/ai/generate
// @access  Private
export const generateItinerary = async (req, res, next) => {
  try {
    const { destination, days, budget, travelers, interests, travelStyle } = req.body;

    if (!destination || !days) {
      res.status(400);
      throw new Error("Please provide destination and number of days");
    }

    const prompt = buildPrompt({ destination, days, budget, travelers, interests, travelStyle });

    const response = await getAiClient().models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let text = response.text.trim();

    // Gemini sometimes wraps JSON in markdown code fences - strip them if present
    text = text.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      res.status(502);
      throw new Error("AI response could not be parsed. Please try again.");
    }

    res.json(parsed);
  } catch (error) {
    next(error);
  }
};
