import { useState } from "react";

export default function RequestFilters() {
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = () => {
    // Appel API GET avec filtres
    console.log("Recherche:", city, category);
  };

  return (
    <div className="flex space-x-2">
      <input
        type="text"
        placeholder="Ville"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Catégorie"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 border rounded"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Rechercher
      </button>
    </div>
  );
}