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
import Posts from "./pages/Posts";
import PostDetails from "./pages/PostDetails";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { PostProvider } from "./context/PostContext";
import { CommentProvider } from "./context/CommentContext";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { ReactionProvider } from "./context/ReactionContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <PostProvider>
          <CommentProvider>
            <ReactionProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public pages */}
                  <Route element={<AuthLayout />}>
                    <Route
                      path="/login"
                      element={<Login />}
                    />
                    <Route
                      path="/sign-up"
                      element={<SignUp />}
                    />
                  </Route>
                  {/* Protected pages */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                      {/* Home */}
                      <Route
                        path="/"
                        element={<App />}
                      />
                      {/* Posts */}
                      <Route
                        path="/posts"
                        element={<Posts />}
                      />
                      <Route
                        path="/posts/create"
                        element={<CreatePost />}
                      />
                      <Route
                        path="/posts/edit/:id"
                        element={<EditPost />}
                      />
                      <Route
                        path="/posts/:id"
                        element={<PostDetails />}
                      />
                      {/* Users */}
                      <Route
                        path="/users/:id"
                        element={<Profile />}
                      />
                    </Route>
                  </Route>
                  {/* 404 */}
                  <Route
                    path="*"
                    element={<NotFound />}
                  />
                </Routes>
              </BrowserRouter>
            </ReactionProvider>
          </CommentProvider>
        </PostProvider>
      </UserProvider>
    </AuthProvider>
  </StrictMode>,
);