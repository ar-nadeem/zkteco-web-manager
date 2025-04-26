import { useState } from "react";

interface ZKTecoSettings {
  ip: string;
  password: string;
  port: string;
}

interface NavbarProps {
  settings: ZKTecoSettings;
  onSettingsChange: (settings: ZKTecoSettings) => void;
}

const Navbar = ({ settings, onSettingsChange }: NavbarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle input changes
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onSettingsChange({ ...settings, [name]: value });
  };

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Title */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold">ZKTeco Manager</span>
          </div>

          {/* Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-black transition-colors duration-200"
            >
              Settings
              <svg
                className={`ml-2 h-5 w-5 transform ${
                  isDropdownOpen ? "rotate-180" : ""
                } transition-transform duration-200`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10">
                <div className="px-4 py-2">
                  <div className="mb-3">
                    <label className="block text-black text-sm font-medium mb-1">
                      IP Address
                    </label>
                    <input
                      type="text"
                      name="ip"
                      value={settings.ip}
                      onChange={handleSettingsChange}
                      className="w-full px-3 py-2 border rounded-md text-black text-sm"
                      placeholder="Enter IP address"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-black text-sm font-medium mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={settings.password}
                      onChange={handleSettingsChange}
                      className="w-full px-3 py-2 border rounded-md text-black text-sm"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-black text-sm font-medium mb-1">
                      Port
                    </label>
                    <input
                      type="text"
                      name="port"
                      value={settings.port}
                      onChange={handleSettingsChange}
                      className="w-full px-3 py-2 border rounded-md text-black text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
