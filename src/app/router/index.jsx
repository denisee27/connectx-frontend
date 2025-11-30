// You can youse lazy load if you want
// But please change the error boundary system
// Because all of the system has their on cycle

import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy } from "react";
import SessionExpiredModal from "../../features/auth/components/SessionExpiredModal.jsx";
import { MainLayout } from "../../shared/components/layouts/MainLayout.jsx";
import PublicRoute from "../../shared/components/guards/PublicRoute.jsx";
import LoginPage from "../../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../../features/auth/pages/RegisterPage.jsx";
import ForgotPasswordPage from "../../features/auth/pages/ForgotPasswordPage.jsx";
import ForbiddenPage from "../../shared/components/pages/ForbiddenPage.jsx";
import ErrorBoundary from "../../shared/components/ui/ErrorBoundary.jsx";
import NotFoundPage from "../../shared/components/pages/NotFoundPage.jsx";
import MainPage from "../../features/landingPage/pages/MainPage.jsx";
import Dashboard from "../../features/dashboard/pages/Dashboard.jsx";
import { Profile } from "../../features/profile/pages/Profile.jsx";
import { Schedule } from "../../features/schedule/pages/Schedule.jsx";
import { Setting } from "../../features/setting/pages/Setting.jsx";
import { NewEvent } from "../../features/newEvent/pages/NewEvent.jsx";
import Event from "../../features/event/pages/Event.jsx";
import { ListEvent } from "../../features/listEvent/pages/ListEvent.jsx";
import DetailCategory from "../../features/detailCategory/pages/DetailCategory.jsx";
import FormProfile from "../../features/profiling/pages/FormProfile.jsx";
import Questioner from "../../features/profiling/pages/Questioner.jsx";
import Preference from "../../features/profiling/pages/Preference.jsx";
import Suggestion from "../../features/profiling/pages/Suggestion.jsx";
import VerifyEmailPage from "../../features/auth/pages/verifyEmailPage.jsx";
import PaymentStatus from "../../features/paymentStatus/pages/PaymentStatus.jsx";
import ProtectedRoute from "../../shared/components/guards/ProtectedRoute.jsx";
import ResetPasswordPage from "../../features/auth/pages/ResetPassword.jsx";
const DashboardLazy = lazy(() => import("../../features/dashboard/pages/Dashboard.jsx"));

const RootLayout = () => (
  <ErrorBoundary>
    <SessionExpiredModal />
    <Outlet />
  </ErrorBoundary>
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        children: [
          {
            element: <PublicRoute />,
            children: [
              { path: "/login", element: <LoginPage /> },
              { path: "/register", element: <RegisterPage /> },
              { path: "/forgot-password", element: <ForgotPasswordPage /> },
              { path: "/verify", element: <VerifyEmailPage /> },
              { path: "/reset-password", element: <ResetPasswordPage /> },
              { path: "/reset-password/:token:email", element: <ResetPasswordPage /> },
            ]
          },
          { path: "/", element: <MainPage /> },
          { path: "/profiling/questioner", element: <Questioner /> },
          { path: "/profiling/preference", element: <Preference /> },
          { path: "/profiling/form", element: <FormProfile /> },
          { path: "/profiling/suggestion", element: <Suggestion /> },
        ],
      },

      {
        path: "/forbidden",
        element: <ForbiddenPage />,
      },
      {
        path: "/home",
        children: [
          {
            element: <MainLayout />,
            children: [
              {
                element: <ProtectedRoute />,
                children: [
                  { path: "profile", element: <Profile /> },
                  { path: "schedule", element: <Schedule /> },
                  { path: "setting", element: <Setting /> },
                  { path: "payment-status", element: <PaymentStatus /> },
                ]
              },
              { index: true, element: <Dashboard /> },
              { path: "new-event", element: <NewEvent /> },
              { path: "list-event", element: <ListEvent /> },
              { path: "category/:slug", element: <DetailCategory /> },
              { path: "event/:slug", element: <Event /> },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
