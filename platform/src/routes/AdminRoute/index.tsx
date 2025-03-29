import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Button } from "antd";
import { logoutAction } from "../../redux/actions/auth-actions";
import DashboardView from "../../layout";

const AdminRoute = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const isAdminENV = JSON.parse(import.meta.env.VITE_ADMIN) || false;

  const logout = async () => {
    try {
      await dispatch(logoutAction()).unwrap();
    } catch (error) {
      console.log({ error });
    }
  };

  if (!user) {
    return <Navigate to={'/auth/sign-in'} state={location} />
  }
  else if (isAdminENV && !user.admin){
    return (
      <>
        <p style={{ textTransform: 'capitalize'}}>you are not authorized</p>
        <Button danger onClick={logout}>Logout</Button>
      </>
    );
  }

  return <DashboardView admin={isAdminENV && user.admin} />
};

export default AdminRoute;