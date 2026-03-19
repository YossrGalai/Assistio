import { Marker, Popup } from "react-leaflet";
import type { Request } from "../../types/request";


export default function RequestMarker({ request }: { request: Request }) {
  if (!request.latitude || !request.longitude) return null;

  return (
    <Marker position={[request.latitude, request.longitude]}>
      <Popup>
        <div className="p-2 w-64">
          <h3 className="font-bold text-lg">{request.title}</h3>
          <p className="text-sm">{request.description}</p>
          <p className="text-xs font-semibold" >{request.city}</p>
          <p className="mt-1 font-semibold">Status: {request.status}</p>
          <p className="text-xs font-semibold" >Categorie: {request.category}</p>
          <p className="text-xs font-semibold" >Urgence: {request.urgency}</p>
        </div>
      </Popup>
    </Marker>
  );
}