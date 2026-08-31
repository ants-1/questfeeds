import {
  createContext,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/hooks/useAuth";

import { API_URL } from "@/config/api";

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface UserContextType {
  users: User[];
  pagination: Pagination | null;
  isLoading: boolean;

  getUser: (id: string) => Promise<User>;

  getUsers: (
    page?: number,
    limit?: number,
    search?: string,
  ) => Promise<void>;

  updateUser: (
    id: string,
    username: string,
    email: string,
    avatar?: string,
    bio?: string,
  ) => Promise<User>;

  updatePassword: (
    id: string,
    oldPassword: string,
    newPassword: string,
  ) => Promise<void>;
}

export const UserContext = createContext<
  UserContextType | undefined
>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({
  children,
}: UserProviderProps) {
  const { accessToken } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const getAuthHeaders = () => {
    if (!accessToken) {
      throw new Error("You are not authenticated");
    }

    return {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
  };

  const getUser = async (id: string): Promise<User> => {
    const response = await fetch(
      `${API_URL}/users/${id}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to get user",
      );
    }

    return data.data.user;
  };

  const getUsers = async (
    page = 1,
    limit = 10,
    search = "",
  ) => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        params.append("search", search);
      }

      const response = await fetch(
        `${API_URL}/users?${params.toString()}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to get users",
        );
      }

      setUsers(data.data.users);
      setPagination(data.data.pagination);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (
    id: string,
    username: string,
    email: string,
    avatar?: string,
    bio?: string,
  ): Promise<User> => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/users/${id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            username,
            email,
            avatar,
            bio,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to update user",
        );
      }

      return data.data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (
    id: string,
    oldPassword: string,
    newPassword: string,
  ) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/users/${id}/password`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to update password",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        pagination,
        isLoading,
        getUser,
        getUsers,
        updateUser,
        updatePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}