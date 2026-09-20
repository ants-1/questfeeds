import {
  createContext,
  useCallback,
  useState,
  type ReactNode,
} from "react";

import { API_URL } from "@/config/api";
import { useAuth } from "@/hooks/useAuth";

export interface CommentAuthor {
  _id: string;
  username: string;
  avatar?: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: CommentAuthor | string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  postId: string;
  content: string;
  author: string;
}

export interface UpdateCommentData {
  postId: string;
  commentId: string;
  content: string;
  author: string;
}

export interface DeleteCommentData {
  postId: string;
  commentId: string;
  author: string;
}

export interface CommentResult {
  comment: Comment;
  message: string;
  levelInfo?: {
    level: number;
    currentXp: number;
    xpForNextLevel: number;
    totalXp: number;
  };
}

interface CommentContextType {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;

  createComment: (
    data: CreateCommentData,
  ) => Promise<CommentResult>;

  updateComment: (
    data: UpdateCommentData,
  ) => Promise<CommentResult>;

  deleteComment: (
    data: DeleteCommentData,
  ) => Promise<void>;

  clearError: () => void;
}

export const CommentContext = createContext<
  CommentContextType | undefined
>(undefined);

interface CommentProviderProps {
  children: ReactNode;
}

export function CommentProvider({
  children,
}: CommentProviderProps) {
  const [comments, setComments] = useState<Comment[]>(
    [],
  );

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const { accessToken } = useAuth();

  const getAuthHeaders = () => {
    if (!accessToken) {
      throw new Error(
        "You are not authenticated",
      );
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

  const createComment = useCallback(
    async (
      data: CreateCommentData,
    ): Promise<CommentResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/posts/${data.postId}/comments`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              postId: data.postId,
              content: data.content,
              author: data.author,
            }),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to create comment",
          );
        }

        const commentResult: CommentResult =
          result.data;

        setComments((prev) => [
          ...prev,
          commentResult.comment,
        ]);

        return commentResult;
      } catch (error) {
        return handleError(
          error,
          "Unable to create comment",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken],
  );

  const updateComment = useCallback(
    async (
      data: UpdateCommentData,
    ): Promise<CommentResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/posts/${data.postId}/comments/${data.commentId}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              postId: data.postId,
              commentId: data.commentId,
              content: data.content,
              author: data.author,
            }),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to update comment",
          );
        }

        const commentResult: CommentResult =
          result.data;

        setComments((prev) =>
          prev.map((comment) =>
            comment._id === data.commentId
              ? commentResult.comment
              : comment,
          ),
        );

        return commentResult;
      } catch (error) {
        return handleError(
          error,
          "Unable to update comment",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken],
  );

  const deleteComment = useCallback(
    async (
      data: DeleteCommentData,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/posts/${data.postId}/comments/${data.commentId}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              postId: data.postId,
              commentId: data.commentId,
              author: data.author,
            }),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to delete comment",
          );
        }

        setComments((prev) =>
          prev.filter(
            (comment) =>
              comment._id !== data.commentId,
          ),
        );
      } catch (error) {
        handleError(
          error,
          "Unable to delete comment",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <CommentContext.Provider
      value={{
        comments,
        isLoading,
        error,
        createComment,
        updateComment,
        deleteComment,
        clearError,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
}