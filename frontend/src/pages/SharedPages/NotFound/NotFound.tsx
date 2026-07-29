import "./NotFound.style.scss";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className='notfound'>
      <img src='./gif/NotFound.gif' alt='Not Found' className='notfound__image' />
      <div className='notfound__text'>{t("pageNotFound")}</div>
    </div>
  );
};

export default NotFound;
