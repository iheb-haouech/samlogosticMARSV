import { primaryColor, secondaryColor } from "../../globalVar/colors";

export const antdThemeConfig = {
  token: {
    colorPrimary: primaryColor,        // #0d2c58
    colorLink: secondaryColor,          // #5890cc
    colorTextBase: "#0d2c58",
    colorBgBase: "#ffffff",
    fontFamily: "'Open Sans', sans-serif",
    fontSize: 14,
    borderRadius: 6,
  },
  components: {
    Button: {
      primaryColor: "#ffffff",
      colorPrimary: primaryColor,
      colorPrimaryHover: secondaryColor,
      fontWeight: 500,
    },
    Layout: {
      headerBg: primaryColor,
      siderBg: primaryColor,
      bodyBg: "#f5f5f5",
    },
    Menu: {
      darkItemBg: primaryColor,
      darkItemSelectedBg: secondaryColor,
      darkItemColor: "#ffffff",
      darkItemSelectedColor: "#ffffff",
    },
    Table: {
      headerBg: primaryColor,
      headerColor: "#ffffff",
    },
  },
};
