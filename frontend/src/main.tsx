import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";

import App from "./App";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>

            {/* Public pages */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Route>

            {/* Protected pages */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<App />} />
                <Route
                  path="/users/:id"
                  element={<Profile />}
                />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </UserProvider>
    </AuthProvider>
  </StrictMode >,
);