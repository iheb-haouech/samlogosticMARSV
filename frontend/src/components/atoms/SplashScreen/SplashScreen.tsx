import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SplashScreen.scss";

interface SplashScreenProps {
  isAuthenticated: boolean;
}

const SplashScreen = ({ isAuthenticated }: SplashScreenProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate("/user/dashboard", { replace: true });
      } else {
        localStorage.setItem("hasSeenSplash", "true");
        navigate("/login", { replace: true });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <img src="/png/logoslogan.png" alt="SAM LOGISTIC" className="splash-logo" />
        <div className="splash-loader"></div>
      </div>
    </div>
  );
};

export default SplashScreen;