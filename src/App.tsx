import { useState } from "react";
import "./App.css";
import { socket } from "@/lib/utils";
import { Data, DataContext } from "@/lib/contexts/DataContext";
import Controller from "@/lib/pages/controller";
import { ThemeProvider } from "@/lib/components/theme-provider";

function App() {
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState<Data | null>(null);
  const value = { data, setData };

  socket.on("connect", () => {
    setConnected(true);
    socket.emit("request_data");
  });

  socket.on("server_update", (updatedData: Data) => {
    setData(updatedData);
  });

  socket.on("disconnect", () => {
    setConnected(false);
  });

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DataContext.Provider value={value}>
        <h4 className="absolute top-[20px] right-10">
          {connected ? "Connected" : "Disconnected"}
        </h4>
        <div
          className={
            "absolute top-[28px] right-6 rounded-full h-[10px] w-[10px] " +
            (connected ? "bg-green-500" : "bg-red-500")
          }
        ></div>
        <div className="flex justify-center items-center h-screen py-6 px-6">
          <Controller />
        </div>
      </DataContext.Provider>
    </ThemeProvider>
  );
}

export default App;
