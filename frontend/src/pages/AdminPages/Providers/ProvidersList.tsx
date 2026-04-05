import { Layout } from "antd";
import ApprovedProvidersList from "./components/ApprovedProvidersList";

const ProvidersList: React.FC = () => {
  
  return (
    <Layout style={{ backgroundColor: "white" }}>
      <ApprovedProvidersList />
    </Layout>
  );
};

export default ProvidersList;
