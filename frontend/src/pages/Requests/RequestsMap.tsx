/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import RequestMarker from "../../components/map/RequestMarker";
import type { Request } from "../../types/request";
import { getRequests } from "../../services/requestService";

// ---------------- Props pour filtrage ----------------
interface RequestsMapProps {
  search?: string;          // pour recherche libre
  ville?: string;
  gouvernorat?: string;
  categorie?: string;
}

export default function RequestsMap({
  search = "",
  ville = "",
  gouvernorat = "",
  categorie = "",
}: RequestsMapProps) {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const data = await getRequests();
      console.log("REQUESTS REÇUS:", data.map(r => ({
        id: r.id,
        title: r.title,
        lat: r.latitude,
        lng: r.longitude,
      })));
      setRequests(data);
    };
    fetchRequests();
  }, []);

  // ---------------- Filtrage des demandes ----------------
  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(search.toLowerCase());
    const matchesVille = ville ? req.city?.toLowerCase() === ville.toLowerCase() : true;
    const matchesGouv = gouvernorat ? req.gouvernorat?.toLowerCase() === gouvernorat.toLowerCase() : true;
    const matchesCat = categorie ? req.category?.toLowerCase() === categorie.toLowerCase() : true;
    const hasCoords = req.latitude != null && req.longitude != null;

    return matchesSearch && matchesVille && matchesGouv && matchesCat && hasCoords;
  });

  return (
    <MapContainer center={[36.8065, 10.1815]} zoom={7} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {filteredRequests.map((req) => {
        const lat = req.latitude ?? (req as any).lat;
        const lng = req.longitude ?? (req as any).lng;
        return (
          <RequestMarker key={req.id} request={{ ...req, latitude: lat, longitude: lng }} />
        );
      })}
    </MapContainer>
  );
}