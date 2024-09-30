import CardImagePicker from "./components/CardImagePicker";
import PlayerForm from "./components/PlayerForm";
import TopBar from "./components/TopBar";
import { ThemeProvider } from "@/components/theme-provider";

function Controller({ connected }: { connected: boolean }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TopBar connected={connected} />
      <div className="flex flex-row justify-center min-h-screen gap-6 py-12 px-6">
        <PlayerForm />
        <CardImagePicker />
      </div>
    </ThemeProvider>
  );
}

export default Controller;
