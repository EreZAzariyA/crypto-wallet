import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import DashboardView from "../layout";
import AuthView from "../layout/AuthView";
import SignIn from "../components/auth/sign-in";
import SignUp from "../components/auth/sign-up";
import Dashboard from "../components/dashboard";
import PageNotFound from "../components/page-not-found";
import Transactions from "../components/transactions";

const dashboardRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PrivateRoute element={<DashboardView />} />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "transactions",
        element: <Transactions />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  }
];
const authRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: <PublicRoute element={<AuthView />} />,
    children: [
      {
        index: true,
        element: <Navigate to="sign-in" replace />,
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
];

export const routes = createBrowserRouter([
  ...dashboardRoutes,
  ...authRoutes,
]);