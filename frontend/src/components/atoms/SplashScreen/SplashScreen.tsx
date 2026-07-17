import { useEffect } from "react";
import "./SplashScreen.scss";

interface SplashScreenProps {
  isAuthenticated: boolean;
}

const SplashScreen = ({ isAuthenticated }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        window.location.href = "/user/dashboard";
      } else {
        localStorage.setItem("hasSeenSplash", "true");
        window.location.href = "/";
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

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