import React from "react";
import InvoiceForm from "../../../components/templates/Forms/InvoiceForm/InvoiceForm";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../features/user/userSlice";
import { generateProviderFacture } from "../../../services/generate_pdf";

const Payment: React.FC = () => {
  const currentUser: any = useSelector(selectCurrentUser);
  return (
    <div>
      <InvoiceForm
        userType="l'entreprise"
        onGenerateInvoice={(values: any) => {
          generateProviderFacture(currentUser.id.toString(), values.from, values.to, values?.invoiceType);
        }}
        isAdmin={false}
      />
    </div>
  );
};

export default Payment;
