import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/store";

interface PrivateRouteProps {
  element: React.JSX.Element;
};

const PrivateRoute = (props: PrivateRouteProps) => {
  const location = useLocation();
  const { user_id } = useAppSelector((state) => state.auth);

  if (!user_id) {
    return <Navigate to={'/auth/sign-in'} state={location} />
  }

  return props.element;
};

export default PrivateRoute;