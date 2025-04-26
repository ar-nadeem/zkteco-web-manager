import "./App.css";
import Navbar from "./components/Navbar";
import DeviceConnection from "./components/DeviceConnection";
import QuickActions from "./components/QuickActions";
import { useState, useEffect } from "react";

interface ZKTecoSettings {
  ip: string;
  password: string;
  port: string;
}

const defaultSettings: ZKTecoSettings = {
  ip: "",
  password: "0",
  port: "4370",
};

function App() {
  const [zkSettings, setZkSettings] = useState<ZKTecoSettings>(defaultSettings);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const storedSettings = sessionStorage.getItem("zktecoSettings");
    if (storedSettings) {
      setZkSettings(JSON.parse(storedSettings));
    }
  }, []);

  const handleSettingsChange = (newSettings: ZKTecoSettings) => {
    setZkSettings(newSettings);
    sessionStorage.setItem("zktecoSettings", JSON.stringify(newSettings));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar settings={zkSettings} onSettingsChange={handleSettingsChange} />
      <div className="container mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to ZKTeco Manager
            </h1>
            <p className="text-gray-600 mb-4">
              Manage your ZKTeco devices efficiently with easy to use web-based
              interface.
            </p>
          </div>

          {/* Device Connection Status */}
          <DeviceConnection
            settings={zkSettings}
            isConnected={isConnected}
            onConnectionChange={setIsConnected}
          />

          {/* Quick Actions */}
          <QuickActions isDisabled={!isConnected} zkSettings={zkSettings} />
        </div>
      </div>
    </div>
  );
}

export default App;
