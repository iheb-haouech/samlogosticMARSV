export interface AlertProps {
  type?: "deleted" | "saved" | "created" | "custom";
  mainColor?: string;
  icon?: JSX.Element;
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHandler?: () => void;
  className?: string; // to be removed later
}

export interface AlertContextProps {
  addAlert: (alertProps: AlertProps) => void;
}
