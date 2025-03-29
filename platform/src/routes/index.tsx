import { lazy } from "react";
import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";

const AdminRoute = lazy(() => import("./AdminRoute"));
const PrivateRoute = lazy(() => import("./PrivateRoute"));
const PublicRoute = lazy(() => import("./PublicRoute"));
const SignIn = lazy(() => import("../components/auth/sign-in"));
const SignUp = lazy(() => import("../components/auth/sign-up"));
const Dashboard = lazy(() => import("../components/dashboard"));
const AdminDashboard = lazy(() => import("../components/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("../components/admin/admin-users"));
const Transactions = lazy(() => import("../components/transactions"));
const PageNotFound = lazy(() => import("../components/page-not-found"));

const isAdmin = import.meta.env.VITE_ADMIN ? JSON.parse(import.meta.env.VITE_ADMIN) : false;

export const UserRoutes: RouteObject = {
  path: "/",
  element: <PrivateRoute />,
  children: [
    { path: "dashboard", element: <Dashboard /> },
    { path: "transactions", element: <Transactions /> },
    { path: "sign-out", element: <p>sign-out</p> },
  ],
};

export const AdminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminRoute />,
  children: [
    { path: "dashboard", element: <AdminDashboard /> },
    { path: "users", element: <AdminUsers /> },
    { path: "sign-out", element: <p>sign-out</p> },
  ],
};

export const router = createBrowserRouter([
  {
    path: '/',
    index: true,
    element: <Navigate to={isAdmin ? '/admin/dashboard' : 'dashboard'} />
  },
  {
    path: "/auth",
    element: <PublicRoute />,
    children: [
      { index: true, element: <Navigate to="sign-in" replace /> },
      { path: "sign-in", element: <SignIn /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
  { ...(isAdmin ? AdminRoutes : UserRoutes) },
  { path: "sign-out", element: <p>sign-out</p> },
  { path: "*", element: <PageNotFound /> },
]);