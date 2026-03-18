import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { Request } from "../../types/request";

type Props = {
  formData: Request;
  setFormData: React.Dispatch<React.SetStateAction<Request>>;
  nextStep: () => void;
  prevStep: () => void;
};

function LocationMarker({ setFormData }: { setFormData: Props["setFormData"] }) {
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setPosition([lat, lng]);
      setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function Step2Location({ formData, setFormData, nextStep, prevStep }: Props) {
  const defaultCenter: LatLngExpression = [36.8065, 10.1815];

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">Localisation de la demande</h2>
      <MapContainer
        center={defaultCenter}
        zoom={7}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker setFormData={setFormData} />
      </MapContainer>
      <div className="mt-4 flex justify-between">
        <button
          onClick={prevStep}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Précédent
        </button>
        <button
          onClick={nextStep}
          disabled={!formData.latitude || !formData.longitude}
          className={`px-4 py-2 rounded text-white ${formData.latitude && formData.longitude ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}