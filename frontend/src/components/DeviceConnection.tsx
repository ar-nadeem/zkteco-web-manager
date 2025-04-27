import { useState } from "react";
import { deviceAPI } from "../apiHandler/calls";
import { DeviceSettings } from "../apiHandler/types";

interface ZKTecoSettings {
  ip: string;
  password: string;
  port: string;
}

interface DeviceConnectionProps {
  settings: ZKTecoSettings;
  isConnected: boolean;
  onConnectionChange: (status: boolean) => void;
}

const DeviceConnection = ({
  settings,
  isConnected,
  onConnectionChange,
}: DeviceConnectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusMessage = () => {
    if (isLoading) return "Testing Connection...";
    if (error) return error;
    if (isConnected) return "Connection Succeeded";
    if (settings.ip) return "Ready to Test Connection";
    return "Not Connected";
  };

  const getStatusColor = () => {
    if (isLoading) return "text-blue-500";
    if (error) return "text-red-500";
    if (isConnected) return "text-green-500";
    if (settings.ip) return "text-yellow-500";
    return "text-red-500";
  };

  const handleTestConnection = async () => {
    if (!settings.ip || !settings.port || !settings.password) {
      setError("Please configure all device settings first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const deviceSettings: DeviceSettings = {
        ip: settings.ip,
        port: parseInt(settings.port),
        password: settings.password,
        force_udp: false,
        ommit_ping: true,
        timeout: 2,
      };

      await deviceAPI.testConnection(deviceSettings);
      onConnectionChange(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
      onConnectionChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Device Connection Status
        </h2>
        <button
          onClick={handleTestConnection}
          disabled={isLoading || !settings.ip}
          className={`px-4 py-2 rounded-md text-white ${
            isLoading || !settings.ip
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-700 hover:bg-gray-700"
          }`}
        >
          {isLoading ? "Testing..." : "Test Connection"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-gray-500">IP Address</p>
          <p className="text-lg font-medium">
            {settings.ip || "Not configured"}
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-gray-500">Port</p>
          <p className="text-lg font-medium">{settings.port}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-gray-500">Status</p>
          <p className={`text-lg font-medium ${getStatusColor()}`}>
            {getStatusMessage()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeviceConnection;
