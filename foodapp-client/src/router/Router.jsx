import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import AdminRoute from "./AdminRoute";

const Main = lazy(() => import("../layout/Main"));
const Home = lazy(() => import("../pages/home/Home"));
const Menu = lazy(() => import("../pages/menuPage/Menu"));
const Offers = lazy(() => import("../pages/offers/Offers"));
const Contact = lazy(() => import("../pages/support/Contact.jsx"));
const Signup = lazy(() => import("../components/Signup"));
const Order = lazy(() => import("../pages/dashboard/Order"));
const UserProfile = lazy(() => import("../pages/dashboard/UserProfile"));
const Settings = lazy(() => import("../pages/dashboard/Settings.jsx"));
const CartPage = lazy(() => import("../pages/menuPage/CartPage"));
const Login = lazy(() => import("../components/Login"));
const DashboardLayout = lazy(() => import("../layout/DashboardLayout"));
const Dashboard = lazy(() => import("../pages/dashboard/admin/Dashboard"));
const Users = lazy(() => import("../pages/dashboard/admin/Users"));
const ManageBookings = lazy(() => import("../pages/dashboard/admin/ManageBookings"));
const AddMenu = lazy(() => import("../pages/dashboard/admin/AddMenu"));
const ManageItems = lazy(() => import("../pages/dashboard/admin/ManageItems"));
const UpdateMenu = lazy(() => import("../pages/dashboard/admin/UpdateMenu"));
const Payment = lazy(() => import("../pages/menuPage/Payment"));

const withSuspense = (component) => (
  <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
    {component}
  </Suspense>
);

const router = createBrowserRouter([
  // users
  {
    path: "/",
    element: withSuspense(<Main />),
    children: [
      {
        path: "/",
        element: withSuspense(<Home />),
      },
      {
        path: "/menu",
        element: withSuspense(<Menu />),
      },
      {
        path: "/offers",
        element: withSuspense(<Offers />),
      },
      {
        path: "/contact",
        element: <PrivateRoute>{withSuspense(<Contact />)}</PrivateRoute>,
      },
      {
        path: "/order",
        element: (
          <PrivateRoute>
            {withSuspense(<Order />)}
          </PrivateRoute>
        ),
      },
      {
        path: "/update-profile",
        element: <PrivateRoute>{withSuspense(<UserProfile />)}</PrivateRoute>,
      },
      {
        path: "/settings",
        element: <PrivateRoute>{withSuspense(<Settings />)}</PrivateRoute>,
      },
      {
        path: "/cart-page",
        element: <PrivateRoute>{withSuspense(<CartPage />)}</PrivateRoute>,
      },
      {
        path: "/process-checkout",
        element: <PrivateRoute>{withSuspense(<Payment />)}</PrivateRoute>
      },
    ],
  },
  {
    path: "/signup",
    element: withSuspense(<Signup />),
  },
  {
    path: "/login",
    element: withSuspense(<Login />),
  },
  // Admin
  {
    path: "dashboard",
    element: (
      <AdminRoute>
        {withSuspense(<DashboardLayout />)}
      </AdminRoute>
    ),
    children: [
      {
        path: "",
        element: withSuspense(<Dashboard />),
      },
      {
        path: "users",
        element: withSuspense(<Users />),
      },
      {
        path: "bookings",
        element: withSuspense(<ManageBookings />),
      },
      {
        path: "add-menu",
        element: withSuspense(<AddMenu />),
      },
      {
        path: "manage-items",
        element: withSuspense(<ManageItems />),
      },
      {
        path: "contact",
        element: withSuspense(<Contact />),
      },
      {
        path: "update-menu/:id",
        element: withSuspense(<UpdateMenu />),
        loader: async ({ params }) => {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL || "https://foodapp-client-xy6z.onrender.com/"}/menu/${params.id}`
          );
          const json = await res.json();
          return json?.data || json;
        },
      },
    ],
  },
]);

export default router;
