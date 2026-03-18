import type { CreateRequestDTO } from "../../types/request";
import { createRequest } from "../../services/requestService";

type Props = {
  formData: CreateRequestDTO;
  prevStep: () => void;
};

export default function Step3Summary({ formData, prevStep }: Props) {

  const handleSubmit = async () => {
    try {
      const result = await createRequest(formData);

      console.log("Request créée :", result);
      alert("Demande créée avec succès ✅");

    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création ❌");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-3 border rounded shadow-md">
      <h2 className="text-xl font-semibold">Résumé</h2>

      <p><strong>Titre :</strong> {formData.title}</p>
      <p><strong>Description :</strong> {formData.description}</p>
      <p><strong>Catégorie :</strong> {formData.category}</p>
      <p><strong>Urgence :</strong> {formData.urgency}</p>
      <p><strong>Localisation :</strong> {formData.latitude}, {formData.longitude}</p>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Précédent
        </button>

        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Confirmer
        </button>
      </div>
    </div>
  );
}