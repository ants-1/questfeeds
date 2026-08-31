import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const API_URL = "http://localhost:3000/api/v1";

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;

  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;

  login: (
    username: string,
    password: string,
  ) => Promise<void>;

  logout: () => Promise<void>;

  refresh: () => Promise<void>;
}

export const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [accessToken, setAccessToken] = useState<
    string | null
  >(null);

  const [isLoading, setIsLoading] = useState(true);

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    const response = await fetch(
      `${API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Registration failed",
      );
    }
  };

  const login = async (
    username: string,
    password: string,
  ) => {
    const response = await fetch(
      `${API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Login failed",
      );
    }

    setAccessToken(data.data.token);
    setUser(data.data.user);
  };

  const refresh = async () => {
    const response = await fetch(
      `${API_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setAccessToken(null);
      setUser(null);

      throw new Error(
        data.error || "Unable to refresh token",
      );
    }

    setAccessToken(data.data.token);
    setUser(data.data.user);
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: accessToken
          ? {
            Authorization: `Bearer ${accessToken}`,
          }
          : undefined,
        credentials: "include",
      });
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        await refresh();
      } catch {
        // No valid refresh token/session
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        register,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}