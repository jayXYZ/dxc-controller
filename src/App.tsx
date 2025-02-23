import { useEffect, useState } from "react";
import "./App.css";
import { socket } from "@/lib/utils/utils";
import { Data, DataContext } from "@/lib/contexts/DataContext";
import Controller from "@/lib/pages/controller";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Overlay from "@/lib/pages/overlay";
import Overlay2 from "@/lib/pages/overlay2";
import Card from "@/lib/pages/card";
import Deck1 from "@/lib/pages/deck1";
import Deck2 from "@/lib/pages/deck2";

function App() {
  const [connected, setConnected] = useState(socket.connected);
  const [data, setData] = useState({});
  const value = { data, setData };

  useEffect(() => {
    function onConnect() {
      setConnected(true);
      socket.emit('request_data');
    }

    function onDisconnect() {
      setConnected(false);
    }

    function onServerUpdate(newdata: Data) {
      setData(newdata);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('server_update', onServerUpdate);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('server_update', onServerUpdate);
    }
  }, [])

  return (
    <DataContext.Provider value={value}>
      <Router>
        <Routes>
          <Route path="/" element={<Controller connected={connected} />} />
          <Route path="/overlay" element={<Overlay />} />
          <Route path="/overlay2" element={<Overlay2 />} />
          <Route path="/card" element={<Card />} />
          <Route path="/deck1" element={<Deck1 />} />
          <Route path="/deck2" element={<Deck2 />} />
        </Routes>
      </Router>
    </DataContext.Provider>
  );
}

export default App;
