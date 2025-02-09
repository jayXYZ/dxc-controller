import CardImagePicker from "./components/CardImagePicker";
import PlayerForm from "./components/PlayerForm";
import TopBar from "./components/TopBar";
// import Timer from "./components/Timer"
import Spicerack from "./components/Spicerack";
import LifeOverride from "./components/LifeOverride";
import { ThemeProvider } from "@/components/theme-provider";

function Controller({ connected }: { connected: boolean }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TopBar connected={connected} />
      <div className="flex flex-row justify-center min-h-screen gap-6 py-12 px-6">
        <div className="flex flex-col gap-6">
          <PlayerForm />
          <div className="flex flex-row gap-6 grow">
            <div className="grow">
              <LifeOverride />
            </div>
            <div className="grow">
              <Spicerack />
            </div> 
          </div>
        </div>
        <CardImagePicker />
      </div>
    </ThemeProvider>
  );
}

export default Controller;
