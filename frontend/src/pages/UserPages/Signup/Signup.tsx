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
    <div className="auth-page">
      <img className="auth-page--image" src="./png/loginImage.png" alt="login Image" />
      <div className="auth-page--content">
        <PublicMenu selectedKey="3" />
        <div className="auth-page--form">
          <SignupForm onSignInClick={onLoginClickHandler} onSubmit={handleSignup} />
        </div>
      </div>
    </div>
  );
};

export default Signup;
