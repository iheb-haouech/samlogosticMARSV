import React from "react";
import { Modal, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import "./ReceiptDownloadModal.scss";
import { useTranslation } from "react-i18next";

interface ReceiptDownloadModalProps {
  isLabeltDownloadModalOpen: boolean;
  handleClose: () => void;
  handleDownloadLabel: () => void;
}

const ReceiptDownloadModal: React.FC<ReceiptDownloadModalProps> = ({
  isLabeltDownloadModalOpen,
  handleClose,
  handleDownloadLabel,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={t("downloadOrderLabel")}
      open={isLabeltDownloadModalOpen}
      onCancel={handleClose}
      footer={
        <div className='modal-footer'>
          <Button danger onClick={handleClose}>
            {t("skipForNow")}
          </Button>
        </div>
      }
    >
      <div className='modal-content'>
        <div className='modal-item'>
          <h4 className='item-title'>{t("orderLabel")}</h4>
          <div className='item-buttons'>
            <Button
              type='primary'
              className='button-download'
              icon={<DownloadOutlined />}
              size='middle'
              onClick={handleDownloadLabel}
            >
              {t("telecharger")}
            </Button>
          </div>
        </div>
      </div>
      <img className='modal-image' src='/png/etiquette.png' alt='Etiquette' />
      <p className='modal-description'>{t("downloadAndAttachLabel")}</p>
    </Modal>
  );
};

export default ReceiptDownloadModal;
