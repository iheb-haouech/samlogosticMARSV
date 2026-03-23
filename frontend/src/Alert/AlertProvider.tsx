import React, { createContext, useState, useContext, useEffect } from "react";
import AlertQueue from "./AlertQueue"; // Make sure this component is implemented to handle alert rendering
import { AlertContextProps, AlertProps } from "./AlertProps";
import { setAlertFunction } from "./alertModule"; // Make sure this function is implemented

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

interface AlertProviderProps {
  children: React.ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  const addAlert = (alertProps: AlertProps) => {
    setAlerts((prevAlerts) => {
      let updatedAlerts = [...prevAlerts, alertProps];

      if (updatedAlerts.length > 3) {
        updatedAlerts = updatedAlerts.slice(updatedAlerts.length - 3);
      }

      return updatedAlerts;
    });
  };

  useEffect(() => {
    setAlertFunction(addAlert); // Make sure this sets the alert function as needed
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        setAlerts((prevAlerts) => prevAlerts.slice(1));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  return (
    <AlertContext.Provider value={{ addAlert }}>
      <AlertQueue alerts={alerts} removeAlert={() => setAlerts((prevAlerts) => prevAlerts.slice(1))} />
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlerts must be used within an AlertProvider");
  }
  return context;
};
