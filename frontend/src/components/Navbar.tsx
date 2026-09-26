import { Link, NavLink } from "react-router-dom";
import {
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [isUserMenuOpen, setIsUserMenuOpen] =
    useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    closeMobileMenu();
    logout();
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="text-lg font-bold tracking-tight"
        >
          QuestFeeds
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/posts" className={navLinkClass}>
            Explore
          </NavLink>

          {user ? (
            /* User dropdown */
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setIsUserMenuOpen((open) => !open)
                }
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent"
              >
                {/* Avatar */}
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.username}'s avatar`}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}

                {/* Username and level */}
                <div className="hidden flex-col items-start leading-tight lg:flex">
                  <span className="text-sm font-medium">
                    @{user.username}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    Level {user.level}
                  </span>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {isUserMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 rounded-lg border bg-background p-1 shadow-lg"
                >
                  <Link
                    to={`/users/${user._id}`}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                    role="menuitem"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
                <LogIn className="h-4 w-4" />
              </Link>

              <Link
                to="/sign-up"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Sign up
                <UserPlus className="h-4 w-4" />
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={
            isMobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMobileMenuOpen}
          onClick={() =>
            setIsMobileMenuOpen((open) => !open)
          }
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-4 sm:px-6">
            <NavLink
              to="/"
              className={navLinkClass}
              onClick={closeMobileMenu}
            >
              <span className="flex items-center gap-3 py-3">
                Home
              </span>
            </NavLink>

            <NavLink
              to="/posts"
              className={navLinkClass}
              onClick={closeMobileMenu}
            >
              <span className="flex items-center gap-3 py-3">
                Explore
              </span>
            </NavLink>

            {user ? (
              <>
                {/* Mobile user information */}
                <div className="mt-2 flex items-center gap-3 rounded-lg border p-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.username}'s avatar`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-medium">
                      @{user.username}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Level {user.level}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/users/${user._id}`}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>

                <Link
                  to="/sign-up"
                  onClick={closeMobileMenu}
                  className="mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}