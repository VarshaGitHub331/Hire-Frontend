import { useAuthContext } from "../../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const { userState } = useAuthContext();
  if (userState.user_id) return <Navigate to="/" />;
  else {
    return <Outlet />;
  }
}
