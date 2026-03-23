import { AlertProps } from "./AlertProps";

type AlertFunction = (alertProps: AlertProps) => void;

let addAlert: AlertFunction | null = null;

export const setAlertFunction = (alertFunc: AlertFunction) => {
  addAlert = alertFunc;
};

export const triggerAlert = (alertProps: AlertProps) => {
  if (addAlert) {
    addAlert(alertProps);
  } else {
    console.error("Alert function has not been initialized");
  }
};
