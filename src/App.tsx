import { useState } from "react";
import "./App.css";
import { socket } from "@/lib/utils/utils";
import { Data, DataContext } from "@/lib/contexts/DataContext";
import Controller from "@/lib/pages/controller";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Overlay from "@/lib/pages/overlay";
import Overlay2 from "@/lib/pages/overlay2";
import Card from "@/lib/pages/card";

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
    <DataContext.Provider value={value}>
      <Router>
        <Routes>
          <Route path="/" element={<Controller connected={connected} />} />
          <Route path="/overlay" element={<Overlay />} />
          <Route path="/overlay2" element={<Overlay2 />} />
          <Route path="/card" element={<Card />} />
        </Routes>
      </Router>
    </DataContext.Provider>
  );
}

export default App;
