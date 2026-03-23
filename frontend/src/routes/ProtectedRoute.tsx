import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";

type Props = {
  children: JSX.Element;
};

export const ProtectedRoute = ({ children }: Props) => {
  const currentUser = useSelector(selectCurrentUser);
  const token = localStorage.getItem("accessToken");

  if (!currentUser || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
