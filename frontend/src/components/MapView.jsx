import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icons not showing up when bundled with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Re-centers the map whenever the list of points changes
const RecenterMap = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [points, map]);

  return null;
};

// Looks up coordinates for a place name using OpenStreetMap's free Nominatim API
const geocodePlace = async (query) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      query
    )}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (err) {
    console.error("Geocoding failed for:", query, err);
  }
  return null;
};

// Displays every itinerary location on a Leaflet map with markers and a route line
const MapView = ({ destination, itinerary }) => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPoints = async () => {
      setLoading(true);
      const allActivities = (itinerary || []).flatMap((day) => day.activities || []);

      const resolved = [];
      for (const activity of allActivities) {
        // Search "place, destination" for better geocoding accuracy
        const coords = await geocodePlace(`${activity.place}, ${destination}`);
        if (coords) {
          resolved.push({ ...coords, name: activity.place, description: activity.description });
        }
      }
      setPoints(resolved);
      setLoading(false);
    };

    if (destination && itinerary?.length) {
      loadPoints();
    } else {
      setLoading(false);
    }
  }, [destination, itinerary]);

  if (loading) {
    return <div className="card font-body text-sm text-taupe">Loading map locations...</div>;
  }

  if (points.length === 0) {
    return (
      <div className="card font-body text-sm text-taupe">
        No locations could be found on the map yet.
      </div>
    );
  }

  const defaultCenter = [points[0].lat, points[0].lng];

  return (
    <div className="card p-0 overflow-hidden">
      <MapContainer center={defaultCenter} zoom={13} style={{ height: "420px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point, index) => (
          <Marker key={index} position={[point.lat, point.lng]}>
            <Popup>
              <strong>{point.name}</strong>
              {point.description && <p>{point.description}</p>}
            </Popup>
          </Marker>
        ))}
        <Polyline positions={points.map((p) => [p.lat, p.lng])} color="#C1673F" />
        <RecenterMap points={points} />
      </MapContainer>
    </div>
  );
};

export default MapView;
