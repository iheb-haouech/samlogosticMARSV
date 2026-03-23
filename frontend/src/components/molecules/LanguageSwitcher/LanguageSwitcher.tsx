import React from "react";
import { Dropdown, Button, Menu } from "antd";
import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.scss";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  // Add flag URLs for the languages
  const lngs: Record<string, { nativeName: string; flag: string }> = {
    en: { nativeName: "English", flag: "https://flagcdn.com/w320/us.png" },
    fr: { nativeName: "Français", flag: "https://flagcdn.com/w320/fr.png" },
  };

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng); // Persist selected language
  };

  // Fallback to 'en' if `i18n.resolvedLanguage` is undefined
  const currentLanguage = i18n.resolvedLanguage || "en";

  const menu = (
    <Menu>
      {Object.keys(lngs).map((lng) => (
        <Menu.Item key={lng} onClick={() => handleLanguageChange(lng)} disabled={currentLanguage === lng}>
          <img
            src={lngs[lng].flag}
            alt={`${lngs[lng].nativeName} flag`}
            style={{ width: "20px", marginRight: "8px" }}
          />
          {lngs[lng].nativeName}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} arrow>
      <Button style={{ border: "none", boxShadow: "none", padding: "0", backgroundColor: "transparent" }}>
        <img
          src={lngs[currentLanguage].flag}
          alt={`${lngs[currentLanguage].nativeName} flag`}
          style={{ width: "25px", marginRight: "0px" }}
        />
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
