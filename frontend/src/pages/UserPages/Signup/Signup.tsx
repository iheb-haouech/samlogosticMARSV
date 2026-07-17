import SignupForm from "../../../components/templates/Forms/SignupForm/SignupForm";
import { useNavigate } from "react-router-dom";
import { signup } from "../../../features/auth/authSlice";
import { UserDTO } from "../../../api/myApi";
import { store } from "../../../store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../features/user/userSlice";
import "./Auth.scss";

const Signup = () => {
  const navigate = useNavigate();
  const currentUser: any = useSelector(selectCurrentUser);

  const handleSignup = async (newUser: UserDTO) => {
    const payload: UserDTO = {
      ...newUser,
      roleId: 3,
    };

    try {
      const res = await store.dispatch(signup(payload)).unwrap();
      navigate("/login");
      return res;
    } catch (err: any) {
      if (err?.message?.includes("already exists")) {
        alert("Cet email est déjà utilisé, choisis une autre adresse.");
      }
      throw err;
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    if (currentUser?.roleId === 2) {
      navigate("/admin/dashboard", { replace: true });
    } else if (currentUser?.roleId === 3) {
      navigate("/user/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  const onLoginClickHandler = () => {
    navigate("/login");
  };

  return (
    <div className="auth-premium-layout">
      <div className="auth-ambient-rotation"></div>

      <div className="auth-split-container">
        
        {/* Left Side Panel: Perfectly Centered Hero Container */}
        <div className="auth-visual-panel">
          <div className="auth-brand-header" onClick={() => navigate("/")}>
            <div className="icon-shield-rotating">
              <img src="/png/logosam.png" alt="SAM LOGISTIC" />
              <div className="spinning-ring"></div>
            </div>
            <div className="brand-info">
              <span className="title-top">SAM</span>
              <span className="title-sub">LOGISTIC</span>
            </div>
          </div>

          <div className="auth-hero-group">
            <div className="auth-image-frame">
              <img className="auth-main-asset" src="/png/loginImage.png" alt="SAM Workspace Terminal" />
            </div>

            <div className="auth-marketing-deck">
              <h3>Espace Logistique Intégré</h3>
              <p>Inscrivez vos identifiants pour configurer votre profil d'accès, suivre vos flux de distribution et interagir avec la matrice de transport.</p>
            </div>
          </div>
          
          <div className="auth-panel-footer-space"></div>
        </div>

        {/* Right Side Panel: Independent Scrollable Form Panel */}
        <div className="auth-content-panel">
          <div className="mobile-brand-wrapper" onClick={() => navigate("/")}>
            <img src="/png/logosam.png" alt="SAM LOGISTIC" />
            <span>SAM LOGISTIC</span>
          </div>

          <div className="auth-form-card-wrapper">
            <div className="form-context-header">
              <h2>Créer un compte</h2>
              <p>Configurez vos paramètres réseau d'entreprise ci-dessous.</p>
            </div>
            
            <div className="form-component-wrapper">
              <SignupForm onSignInClick={onLoginClickHandler} onSubmit={handleSignup} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;