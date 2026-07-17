import "./UserDashboard.scss";
import { useEffect } from "react";
import { useAppSelector } from "../../../store/hooks";
import {
  fetchClientKpis,
  selectedClientKpis,
  selectedKpisStatus,
} from "../../../features/statistics/statisticsSlice";
import { store } from "../../../store/store";
import { selectCurrentUser } from "../../../features/user/userSlice";
import { B2BKpiDashboard } from "../../../components/templates/B2BKpiDashboard/B2BKpiDashboard";

const UserDashboard: React.FC = () => {
  const clientKpis = useAppSelector(selectedClientKpis);
  const kpisStatus = useAppSelector(selectedKpisStatus);
  const currentUser = useAppSelector(selectCurrentUser);
  const accountName =
    (currentUser as any)?.companyName || (currentUser as any)?.email || undefined;

  useEffect(() => {
    store.dispatch(fetchClientKpis());
  }, []);

  return (
    <div className="user-dashboard">
      <B2BKpiDashboard
        data={clientKpis}
        loading={kpisStatus === "loading"}
        accountName={accountName}
      />
    </div>
  );
};

export default UserDashboard;
