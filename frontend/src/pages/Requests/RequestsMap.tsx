import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import RequestMarker from "../../components/map/RequestMarker";
import type { Request } from "../../types/request";
import { getRequests } from "../../services/requestService";

export default function RequestsMap() {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getRequests();
        setRequests(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <MapContainer center={[36.8065, 10.1815]} zoom={12} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {requests.map((req) => (
        <RequestMarker key={req._id} request={req} />
      ))}
    </MapContainer>
  );
}