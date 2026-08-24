# Wayfarer - AI Travel Planner (MERN Stack)

A full-stack MERN application that helps users plan trips using AI. Users enter a
destination, dates, budget, number of travelers and interests, and the app generates
a day-wise itinerary using Google's Gemini API. The itinerary can be edited, viewed on
an interactive map, tracked against the trip's weather, and paired with an expense
tracker.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Leaflet, Chart.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **AI:** Google Gemini API (`@google/genai`, model `gemini-2.5-flash-lite`)
- **Maps:** Leaflet.js + OpenStreetMap (Nominatim for geocoding, free & no key needed)
- **Weather:** OpenWeather API
- **Auth:** JWT (JSON Web Tokens), bcrypt password hashing

## Design

Warm, minimal palette (cream, sand, clay, rust) with a formal serif/sans pairing:
**Lora** for headings, **Source Sans 3** for body text.

## Project Structure

```
ai-travel-planner/
├── backend/
│   ├── config/        # MongoDB connection
│   ├── controllers/   # Route handler logic
│   ├── middleware/    # Auth + error handling
│   ├── models/        # Mongoose schemas (User, Trip, Expense)
│   ├── routes/        # Express routers
│   ├── utils/         # JWT helper
│   └── server.js
└── frontend/
    └── src/
        ├── components/ # Reusable UI pieces
        ├── context/     # AuthContext
        ├── pages/       # Route-level pages
        └── services/    # Axios instance
```

## Setup Instructions

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env` with:
- `MONGO_URI` - your MongoDB Atlas connection string
- `JWT_SECRET` - any random string
- `GEMINI_API_KEY` - from Google AI Studio (free tier)
- `OPENWEATHER_API_KEY` - from openweathermap.org (free tier)

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Notes

- Gemini's `@google/generative-ai` package is deprecated - this project uses the
  newer `@google/genai` package with the `gemini-2.5-flash-lite` model (current
  free-tier model as of mid-2026).
- Leaflet uses free OpenStreetMap Nominatim for geocoding place names into
  coordinates - no API key required, but it's rate-limited, so avoid rapid
  repeated requests.
- No paid APIs are used anywhere in this project.
