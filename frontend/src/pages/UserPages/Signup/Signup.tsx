import SignupForm from "../../../components/templates/Forms/SignupForm/SignupForm";
import { useNavigate } from "react-router-dom";
import { signup } from "../../../features/auth/authSlice";
import { UserDTO } from "../../../api/myApi";
import { store } from "../../../store/store";
import "./Auth.scss";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../features/user/userSlice";
import PublicMenu from "../../../components/organisms/PublicMenu/PublicMenu";
const Signup = () => {
  const navigate = useNavigate();
  const currentUser: any = useSelector(selectCurrentUser);

  const handleSignup = (newUser: UserDTO) => {
    const payload: UserDTO = {
      ...newUser,
      roleId: 3, // roleId du client
    };
    store
      .dispatch(signup(payload))
      .unwrap()
      .then(() => {
      // data.email vient de la réponse backend
      navigate('/verify-email', { state: { email: newUser.email } });
    })
    .catch((err) => {
      // ici tu peux afficher une alerte si besoin
      console.error('Signup error', err);
      });
  };

  useEffect(() => {
  if (currentUser) {
    if (!currentUser.verified && currentUser.roleId === 3) {
      // client non vérifié → page de saisie du code
      navigate("/verify-email", { replace: true });
    } else if (currentUser.verified) {
      if (currentUser.roleId === 2) {
        navigate("/admin-dashboard", { replace: true });
      } else if (currentUser.roleId === 3) {
        navigate("/user/dashboard", { replace: true });
      }
    }
  }
}, [currentUser, navigate]);


  const onLoginClickHandler = () => {
    navigate("/login");
  };
  return (
    <div className='auth-page'>
      <img className='auth-page--image' src='./png/loginImage.png' alt='login Image' />
      <div className='auth-page--content'>
        <PublicMenu selectedKey='3' />
        <div className='auth-page--form'>
          <SignupForm onSignInClick={onLoginClickHandler} onSubmit={handleSignup} />
          {/* Download APK Button */}
        </div>
      </div>
    </div>
  );
};

export default Signup;
