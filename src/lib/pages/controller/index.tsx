import CardImagePicker from "./components/CardImagePicker";
import PlayerForm from "./components/PlayerForm";

function Controller() {
  return (
    <div className="flex flex-row justify-center gap-6 px-6">
      <PlayerForm />
      <CardImagePicker />
    </div>
  );
}

export default Controller;
