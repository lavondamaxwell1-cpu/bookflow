import { useEffect, useState } from "react";
import { BusinessSettingsContext } from "./businessSettingsContext";

const defaultSettings = {
  businessName: "BookFlow",
  tagline: "Simple booking software for local businesses.",
  phone: "(555) 555-5555",
  email: "hello@bookflow.com",
  address: "123 Main Street",
};

function BusinessSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("bookflowBusinessSettings");

    if (savedSettings) {
      return JSON.parse(savedSettings);
    }

    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("bookflowBusinessSettings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const resetSettings = () => {
    localStorage.removeItem("bookflowBusinessSettings");
    setSettings(defaultSettings);
  };

  const value = {
    settings,
    updateSettings,
    resetSettings,
  };

  return (
    <BusinessSettingsContext.Provider value={value}>
      {children}
    </BusinessSettingsContext.Provider>
  );
}

export default BusinessSettingsProvider;
