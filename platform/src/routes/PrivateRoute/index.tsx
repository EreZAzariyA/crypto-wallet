import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import DashboardView from "../../layout";
import { Button } from "antd";
import { logoutAction } from "../../redux/actions/auth-actions";

const PrivateRoute = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

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
  if (user.admin) {
    return (
      <>
        <p style={{ textTransform: 'capitalize'}}>you are not in the correct url</p>
        <Button danger onClick={logout}>Logout</Button>
      </>
    )
  }

  return <DashboardView />
};

export default PrivateRoute;