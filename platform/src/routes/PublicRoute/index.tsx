import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import AuthView from "../../layout/AuthView";

const PublicRoute = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  if (user) {
    return <Navigate to={'/'} state={location} />
  }

  return <AuthView />;
};

export default PublicRoute;