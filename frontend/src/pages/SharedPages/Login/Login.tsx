import LoginForm from "../../../components/templates/Forms/loginForm/LoginForm";
import { useNavigate } from "react-router-dom";
import "../../UserPages/Signup/Auth.scss";
import { store } from "../../../store/store";
import { login } from "../../../features/auth/authSlice";
import { LoginDto } from "../../../api/myApi";
import PublicMenu from "../../../components/organisms/PublicMenu/PublicMenu";

const Login = () => {
  const navigate = useNavigate();
  const handleLogin = (loginData: LoginDto) => {
    store.dispatch(login(loginData));
  };

  const onLoginClickHandler = () => {
    navigate("/signup");
  };
  return (
    <div className='auth-page'>
      <img className='auth-page--image' src='./png/loginImage.png' alt='login Image' />
      <div className='auth-page--content'>
        <PublicMenu selectedKey='2' />

        <div className='auth-page--form'>
          <LoginForm onSubmit={handleLogin} onLoginClick={onLoginClickHandler} />
          {/* Download APK Button */}
        </div>
      </div>
    </div>
  );
};

export default Login;
