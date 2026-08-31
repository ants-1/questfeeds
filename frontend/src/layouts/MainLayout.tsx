import { Link, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function MainLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-semibold">
            Questfeeds
          </Link>

          <nav className="flex items-center gap-4">
            {user && (
              <Link to={`/users/${user._id}`}>
                Profile
              </Link>
            )}

            <button
              onClick={logout}
              className="text-sm"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}