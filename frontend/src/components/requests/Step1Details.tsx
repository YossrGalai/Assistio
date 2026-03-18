import type { Request } from "../../types/request";

type Props = {
  formData: Request;
  setFormData: React.Dispatch<React.SetStateAction<Request>>;
  nextStep: () => void;
};

export default function Step1Details({ formData, setFormData, nextStep }: Props) {
  return (
    <div className="space-y-4 p-4 border rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Détails de la demande</h2>

      <input
        type="text"
        placeholder="Titre"
        value={formData.title}
        required
        className="w-full border p-2 rounded"
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
      />

      <textarea
        placeholder="Description"
        value={formData.description}
        required
        className="w-full border p-2 rounded"
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
      />

      <select
        value={formData.category}
        required
        className="w-full border p-2 rounded"
        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
      >
        <option value="">-- Catégorie --</option>
        <option value="Solidarité">Solidarité</option>
        <option value="Santé">Santé</option>
        <option value="Bricolage">Bricolage</option>
      </select>

      <select
        value={formData.urgency}
        required
        className="w-full border p-2 rounded"
        onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value as "faible" | "moyenne" | "élevée" }))}
      >
        <option value="faible">Faible</option>
        <option value="moyenne">Moyenne</option>
        <option value="élevée">Élevée</option>
      </select>

      <button
        onClick={nextStep}
        disabled={!formData.title || !formData.description || !formData.category || !formData.urgency}
        className={`px-4 py-2 rounded text-white ${formData.title && formData.description && formData.category && formData.urgency ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
      >
        Suivant
      </button>
    </div>
  );
}