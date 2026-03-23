import React, { useEffect, useRef, useState } from "react";
import { AlertProps } from "./AlertProps";
import Alert from "./AlertComponent/Alert";
import "./AlertQueue.css";

interface AlertQueueProps {
  alerts: AlertProps[];
  removeAlert: () => void;
}

const AlertQueue: React.FC<AlertQueueProps> = ({ alerts }) => {
  const prevAlertsLengthRef = useRef(alerts.length);
  const [animationClass, setAnimationClass] = useState("");
  useEffect(() => {
    const prevAlertsLength = prevAlertsLengthRef.current;

    if (alerts.length > prevAlertsLength) {
      setAnimationClass("slideIn");
    } else if (alerts.length < prevAlertsLength) {
      setAnimationClass("slideOut");
    }

    prevAlertsLengthRef.current = alerts.length;
  }, [alerts]);

  return (
    <div key={alerts.length} className={`alert-queue`}>
      {alerts.map((alert, index) => (
        <Alert
          className={`alert 
                        ${index === alerts.length - 1 && animationClass === "slideOut" ? " slideOut" : ""}
                        ${index === alerts.length - 1 && animationClass === "slideIn" ? " slideIn" : ""}`}
          key={index}
          {...alert}
        />
      ))}
    </div>
  );
};

export default AlertQueue;
