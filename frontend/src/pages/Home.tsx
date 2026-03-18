import RequestsMap from "./Requests/RequestsMap";
import RequestFilters from "../components/Filters/RequestFilters";

export default function Home() {
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Assistio</h1>
        <div>
          {/* Ajouter bouton login / profil si besoin */}
        </div>
      </header>

      <RequestFilters />
      <div className="mt-4 h-[600px] rounded shadow">
        <RequestsMap />
      </div>
    </div>
  );
}