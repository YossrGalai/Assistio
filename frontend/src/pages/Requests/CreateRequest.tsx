import CreateRequestForm from "../../components/requests/CreateRequestForm";

export default function CreateRequest() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Nouvelle demande d'aide
      </h1>
      <CreateRequestForm />
    </div>
  );
}