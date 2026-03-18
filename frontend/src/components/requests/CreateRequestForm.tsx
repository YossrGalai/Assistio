import { useState } from "react";
import Step1Details from "./Step1Details";
import Step2Location from "./Step2Location";
import Step3Summary from "./Step3Summary";
import type { Request } from "../../types/request";

export default function CreateRequestForm() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<Request>({
    _id: "",
    title: "",
    description: "",
    category: "",
    urgency: "faible",
    latitude: undefined,
    longitude: undefined,
    city: "",
    gouvernorat: "",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Créer une nouvelle demande</h1>

      <div className="flex justify-center mb-4">
        <div className="flex space-x-2">
          <div className={`w-6 h-6 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          <div className={`w-6 h-6 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          <div className={`w-6 h-6 rounded-full ${step >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
        </div>
      </div>

      {step === 1 && (
        <Step1Details formData={formData} setFormData={setFormData} nextStep={nextStep} />
      )}
      {step === 2 && (
        <Step2Location
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      {step === 3 && (
        <Step3Summary formData={formData} prevStep={prevStep} />
      )}
    </div>
  );
}