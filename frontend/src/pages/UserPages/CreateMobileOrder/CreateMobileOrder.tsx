import { useState, useRef, useEffect } from "react";
import { Button, Input, message, Card, Space, Steps } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Order, PackagesData } from "../../../types/Order";
import PackageTable from "../../../components/organisms/Tables/PackageTable/PackageTable";
import type { InputRef } from "antd";
import { store } from "../../../store/store";
import { addOrder } from "../../../features/order/orderSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../features/user/userSlice";
import "./CreateMobileOrder.scss";

interface CreateMobileOrderProps {
  onClose?: () => void;
}

const CreateMobileOrder: React.FC<CreateMobileOrderProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const currentUser: any = useSelector(selectCurrentUser);
  const isB2C = currentUser?.accountType === "B2C";

  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({
    recipient: {
      companyName: "",
      phone: "",
      city: "",
      country: "",
      streetAddress: "",
      secondAddress: "",
      zipCode: "",
      email: "",
    },
    description: "",
  });
  const [packagesData, setPackagesData] = useState<PackagesData>({ packages: [], totalQuantity: 0, totalPrice: 0 });
  const inputRef = useRef<InputRef>(null);
  const [loading, setLoading] = useState(false);

  const isLightShipment = true;
  const fixedShipmentPrice = isB2C && isLightShipment ? 7 : 0;

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handlePackagesChange = (newPackagesData: PackagesData) => {
    setPackagesData(newPackagesData);
  };

  const handleNestedFieldsChange =
    (field: "recipient", nestedField: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [field]: { ...prev[field], [nestedField]: event.target.value },
      }));
    };

  const handleSubmit = async () => {
    if (isB2C && packagesData?.packages.some((pkg: any) => !pkg.price || pkg.price <= 0)) {
      message.error("Veuillez saisir le prix de chaque colis.");
      return;
    }

    const packagesTotalPrice =
      packagesData?.packages.reduce(
        (total: number, pkg: any) => total + Number(pkg.price || 0) * Number(pkg.quantity || 1),
        0,
      ) || 0;

    const newOrderToSend: Order = {
      description: formValues.description,
      totalWeight: packagesData?.totalWeight || 0,
      totalQuantity: packagesData?.totalQuantity || 0,
      totalPrice: isB2C ? packagesTotalPrice : null,
      clientPrice: null,
      transporterPrice: null,
      packages: packagesData?.packages.map(({ index, ...pkgg }: any) => pkgg),
      refrences: [],
      shipmentPrice: fixedShipmentPrice,
      source: {
        email: currentUser?.email || "",
        companyName: currentUser?.companyName || "",
        phone: currentUser?.phone || "",
        city: currentUser?.city || "",
        country: currentUser?.country || "",
        streetAddress: currentUser?.address || "",
        secondAddress: "",
        zipCode: currentUser?.zipCode || "",
      },
      recipient: formValues.recipient,
      mainType: "national",
      subType: "envoieLegere",
    };

    setLoading(true);
    try {
      await store.dispatch(addOrder(newOrderToSend)).unwrap();
      message.success("Commande créée avec succès");
      navigate("/user/orders");
    } catch {
      message.error("Erreur lors de la création de la commande");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return formValues.recipient.companyName && formValues.recipient.city;
    }
    if (currentStep === 1) {
      return packagesData.packages.length > 0;
    }
    return true;
  };

  const steps = [
    { title: "Destinataire" },
    { title: "Colis" },
    { title: "Récapitulatif" },
  ];

  if (isB2C && currentStep === 2) {
    return (
      <div className="create-mobile-order">
        <Card>
          <Space direction="vertical" style={{ width: "100%" }}>
            <h3>Récapitulatif</h3>
            <div className="summary-section">
              <h4>Destinataire:</h4>
              <p>{formValues.recipient.companyName}</p>
              <p>{formValues.recipient.city}</p>
            </div>
            <div className="summary-section">
              <h4>Colis ({packagesData.totalQuantity}):</h4>
              <p>Total: {(packagesData.totalPrice || 0)} DT</p>
              {fixedShipmentPrice > 0 && <p>Frais de transport: {fixedShipmentPrice} DT</p>}
              <p className="total-amount">Total TTC: {(packagesData.totalPrice || 0) + fixedShipmentPrice} DT</p>
            </div>
            <Space>
              <Button onClick={() => setCurrentStep(1)}>Retour</Button>
              <Button type="primary" loading={loading} onClick={handleSubmit}>
                Valider la commande
              </Button>
            </Space>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="create-mobile-order">
      <div className="mobile-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            if (currentStep > 0) {
              setCurrentStep(currentStep - 1);
            } else if (onClose) {
              onClose();
            }
          }}
        />
        <Steps current={currentStep} size="small" items={steps} style={{ flex: 1, marginLeft: 12 }} />
      </div>

      <div className="mobile-step-content">
        {currentStep === 0 && (
          <Card title="Destinataire">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Input
                placeholder="Société"
                value={formValues.recipient.companyName}
                onChange={handleNestedFieldsChange("recipient", "companyName")}
                size="large"
              />
              <Input
                placeholder="Ville"
                value={formValues.recipient.city}
                onChange={handleNestedFieldsChange("recipient", "city")}
                size="large"
              />
              <Input
                placeholder="Téléphone"
                value={formValues.recipient.phone}
                onChange={handleNestedFieldsChange("recipient", "phone")}
                size="large"
              />
              <Input
                placeholder="Adresse"
                value={formValues.recipient.streetAddress}
                onChange={handleNestedFieldsChange("recipient", "streetAddress")}
                size="large"
              />
            </Space>
          </Card>
        )}

        {currentStep === 1 && (
          <Card title="Colis">
            <PackageTable
              packages={packagesData.packages}
              showPrice={isB2C}
              fixedShipmentPrice={fixedShipmentPrice}
              onPackagesChanges={handlePackagesChange}
            />
            {isB2C && packagesData.packages.length > 0 && (
              <div className="mobile-total">
                <Space>
                  <span>Total colis:</span>
                  <strong>{packagesData.totalPrice} DT</strong>
                </Space>
                {fixedShipmentPrice > 0 && (
                  <Space>
                    <span>Frais transport:</span>
                    <strong>{fixedShipmentPrice} DT</strong>
                  </Space>
                )}
              </div>
            )}
          </Card>
        )}
      </div>

      <div className="mobile-step-actions">
        <Button
          type="primary"
          size="large"
          block
          disabled={!canProceed()}
          onClick={() => currentStep < 2 && setCurrentStep(currentStep + 1)}
        >
          {currentStep < 2 ? "Suivant" : "Créer la commande"}
        </Button>
      </div>
    </div>
  );
};

export default CreateMobileOrder;