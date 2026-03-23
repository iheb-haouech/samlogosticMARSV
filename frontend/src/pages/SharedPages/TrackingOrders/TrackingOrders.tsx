import "./TrakingOrders.scss";
import PublicMenu from "../../../components/organisms/PublicMenu/PublicMenu";
import { TrackOrderForm } from "./TrackOrderForm";

const TrackingOrders: React.FC = () => {
  return (
    <div className='auth-page'>
      <img className='auth-page--image' src='./png/loginImage.png' alt='login Image' />
      <div className='auth-page--content'>
        <PublicMenu selectedKey='1' />
        <TrackOrderForm />
      </div>
    </div>
  );
};
export default TrackingOrders;
