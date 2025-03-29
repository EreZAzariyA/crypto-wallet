import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import DashboardView from "../../layout";

const PrivateRoute = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to={'/auth/sign-in'} state={location} />
  }

  return <DashboardView />
};

export default PrivateRoute;