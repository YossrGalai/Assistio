import { MapContainer, TileLayer } from "react-leaflet";
import type { Request } from "../../types/request";
import RequestMarker from "./RequestMarker";
import type { LatLngExpression } from "leaflet";

type Props = {
  requests: Request[];
};

export default function MapView({ requests }: Props) {
  const tunisiaCenter: LatLngExpression = [36.8065, 9.5375]; // Tunis

  return (
    <MapContainer
      center={tunisiaCenter}
      zoom={6}
      style={{ height: "500px", width: "100%" }}
      maxBounds={[
        [30.0, 7.0],  // sud-ouest
        [37.5, 12.0],  // nord-est
      ]}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {requests.map((req) => (
        <RequestMarker key={req.id ?? req.title} request={req} />
      ))}
    </MapContainer>
  );
}
