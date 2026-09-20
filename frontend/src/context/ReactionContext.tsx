import {
  createContext,
  useCallback,
  useState,
  type ReactNode,
} from "react";

import { API_URL } from "@/config/api";
import { useAuth } from "@/hooks/useAuth";

export interface ReactionResult {
  liked?: boolean;
  disliked?: boolean;
  likesCount?: number;
  dislikesCount?: number;
  likes?: string[];
  dislikes?: string[];
}

interface ReactionContextType {
  isLoading: boolean;
  error: string | null;

  toggleLike: (postId: string) => Promise<ReactionResult>;
  toggleDislike: (postId: string) => Promise<ReactionResult>;

  clearError: () => void;
}

export const ReactionContext = createContext<
  ReactionContextType | undefined
>(undefined);

interface ReactionProviderProps {
  children: ReactNode;
}

export function ReactionProvider({
  children,
}: ReactionProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { accessToken, user } = useAuth();

  const getAuthHeaders = () => {
    if (!accessToken) {
      throw new Error("You are not authenticated");
    }

    return {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
  };

  const handleError = (
    error: unknown,
    fallback: string,
  ) => {
    const message =
      error instanceof Error
        ? error.message
        : fallback;

    setError(message);
    throw new Error(message);
  };

  const toggleLike = useCallback(
    async (postId: string): Promise<ReactionResult> => {
      if (!user?._id) {
        throw new Error("You are not authenticated");
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/posts/${postId}/likes`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              userId: user._id,
            }),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Unable to toggle like",
          );
        }

        return result.data;
      } catch (error) {
        return handleError(
          error,
          "Unable to toggle like",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, user?._id],
  );

  const toggleDislike = useCallback(
    async (postId: string): Promise<ReactionResult> => {
      if (!user?._id) {
        throw new Error("You are not authenticated");
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/posts/${postId}/dislikes`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              userId: user._id,
            }),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Unable to toggle dislike",
          );
        }

        return result.data;
      } catch (error) {
        return handleError(
          error,
          "Unable to toggle dislike",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, user?._id],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ReactionContext.Provider
      value={{
        isLoading,
        error,
        toggleLike,
        toggleDislike,
        clearError,
      }}
    >
      {children}
    </ReactionContext.Provider>
  );
}