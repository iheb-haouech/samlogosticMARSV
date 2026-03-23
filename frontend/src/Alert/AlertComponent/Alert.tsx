import "./Alert.css";
import React, { useState } from "react";
import { AlertProps } from "../AlertProps";
import { AiFillCheckCircle } from "react-icons/ai";
import colors from "../../styles/colors/colors";

type ColorGroup = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

const Alert: React.FC<AlertProps> = ({
  type = "created",
  mainColor = "",
  icon = <AiFillCheckCircle />,
  className = "alert", // to be removed later
  title,
  message,
  actionLabel,
  actionHandler,
  ...props
}) => {
  switch (type) {
    case "deleted":
      title = title ? title : "Confirmation de suppression";
      message = message ? message : "L'élément a été supprimée avec succès !";
      mainColor = mainColor ? mainColor : colors.red[400];
      break;
    case "saved":
      title = title ? title : "Confirmation de modification";
      message = message ? message : "Les modifications ont été enregistrées avec succès !";
      mainColor = colors.green[400];
      break;
    case "created":
      title = title ? title : "Confirmation d'ajout";
      message = message ? message : "L'élément a été ajouté avec succès !";
      mainColor = mainColor ? mainColor : colors.blue[500];
      break;
    default:
      break;
  }

  const getBackgroundColor = (mainColor: string) => {
    let bgColor = "";
    Object.entries(colors).forEach(([_colorKey, colorObj]) => {
      if (typeof colorObj === "object") {
        const colorGroup = colorObj as ColorGroup;
        if (Object.values(colorGroup).includes(mainColor)) {
          bgColor = colorGroup[50];
        }
      }
    });
    return bgColor;
  };

  const CustomIcon = React.cloneElement(icon, {
    className: "alert--icon",
    color: mainColor,
  });

  // State to track if the action button is visible
  const [isActionButtonVisible, setIsActionButtonVisible] = useState(true);

  // Function to handle the action button click
  const handleActionButtonClick = () => {
    if (actionHandler) {
      actionHandler();
    }
    // Hide the action button
    setIsActionButtonVisible(false);
  };

  return (
    <div
      className={className} // to be removed later
      style={{
        borderTop: `solid 5px ${mainColor}`,
        backgroundColor: getBackgroundColor(mainColor),
      }}
      {...props}
    >
      <div className='alert--items'>
        {CustomIcon}
        <div className='alert--text'>
          <div className='alert--title text-md'>{title}</div>
          <div className='alert--message text-md'>{message}</div>
        </div>
        {actionLabel && isActionButtonVisible && actionHandler && (
          <button onClick={handleActionButtonClick} className='alert--action'>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
