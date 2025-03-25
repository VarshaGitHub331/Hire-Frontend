import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

const ProtectedRoute = () => {
  const { userState } = useAuthContext();
  if (!userState.user_id) return <Navigate to="/login" />;
  return <Outlet />;
};
export default ProtectedRoute;
