import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/store";

interface PublicRouteProps {
  element: React.JSX.Element
};

const PublicRoute = (props: PublicRouteProps) => {
  const location = useLocation();
  const { user_id } = useAppSelector((state) => state.auth);

  if (user_id) {
    return <Navigate to={'/'} state={location} />
  }

  return props.element;
};

export default PublicRoute;