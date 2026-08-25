# PlanMyTrip - AI Travel Planner (MERN Stack)

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

