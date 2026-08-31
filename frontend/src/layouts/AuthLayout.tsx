import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="w-full max-w-md px-6">
        <Outlet />
      </main>
    </div>
  );
}