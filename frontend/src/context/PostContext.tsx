import {
  createContext,
  useCallback,
  useState,
  type ReactNode,
} from "react";

import { API_URL } from "@/config/api";
import { useAuth } from "@/hooks/useAuth";

export interface PostAuthor {
  _id: string;
  username: string;
  avatar?: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  featureImg?: string;
  author: PostAuthor | string;
  likes: PostAuthor[];
  dislikes: PostAuthor[];
  comments: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PostsResult {
  posts: Post[];
  pagination: Pagination;
}

export interface CreatePostData {
  title: string;
  content: string;
  featureImg?: string;
  author: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  featureImg?: string;
  author: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PostContextType {
  posts: Post[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;

  getAllPosts: (
    params?: PaginationParams,
  ) => Promise<PostsResult>;

  getPopularPosts: () => Promise<Post[]>;

  getFeedPosts: (
    id: string,
    params?: PaginationParams,
  ) => Promise<PostsResult>;

  getPost: (id: string) => Promise<Post>;

  createPost: (
    data: CreatePostData,
  ) => Promise<Post>;

  updatePost: (
    id: string,
    data: UpdatePostData,
  ) => Promise<Post>;

  deletePost: (
    id: string,
    author: string,
  ) => Promise<void>;

  clearError: () => void;
}

export const PostContext = createContext<
  PostContextType | undefined
>(undefined);

interface PostProviderProps {
  children: ReactNode;
}

export function PostProvider({
  children,
}: PostProviderProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useAuth();

  const getAuthHeaders = () => {
    if (!accessToken) {
      throw new Error("You are not authenticated");
    }

    return {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
  };

  const handleError = (error: unknown, fallback: string) => {
    const message =
      error instanceof Error
        ? error.message
        : fallback;

    setError(message);

    throw new Error(message);
  };

  const getAllPosts = useCallback(
    async (
      params: PaginationParams = {},
    ): Promise<PostsResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const searchParams = new URLSearchParams();

        if (params.page !== undefined) {
          searchParams.set(
            "page",
            params.page.toString(),
          );
        }

        if (params.limit !== undefined) {
          searchParams.set(
            "limit",
            params.limit.toString(),
          );
        }

        if (params.search) {
          searchParams.set(
            "search",
            params.search,
          );
        }

        const query = searchParams.toString();

        const response = await fetch(
          `${API_URL}/posts${query ? `?${query}` : ""}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
            "Unable to get posts",
          );
        }

        const data: PostsResult = result.data;

        setPosts(data.posts);
        setPagination(data.pagination);

        return data;
      } catch (error) {
        return handleError(
          error,
          "Unable to get posts",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const getPopularPosts = useCallback(
    async (): Promise<Post[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/posts/popular`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
            "Unable to get popular posts",
          );
        }

        const data: Post[] = result.data;

        setPosts(data);

        return data;
      } catch (error) {
        return handleError(
          error,
          "Unable to get popular posts",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const getFeedPosts = useCallback(
    async (
      id: string,
      params: PaginationParams = {},
    ): Promise<PostsResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/posts/feed`,
          {
            method: "GET",
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id,
              page: params.page ?? 1,
              limit: params.limit ?? 10,
              search: params.search ?? "",
            }),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
            "Unable to get feed posts",
          );
        }

        const data: PostsResult = result.data;

        setPosts(data.posts);
        setPagination(data.pagination);

        return data;
      } catch (error) {
        return handleError(
          error,
          "Unable to get feed posts",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const getPost = useCallback(
    async (id: string): Promise<Post> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/posts/${id}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
            "Unable to get post",
          );
        }

        return result.data.post;
      } catch (error) {
        return handleError(
          error,
          "Unable to get post",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const createPost = useCallback(
    async (
      data: CreatePostData,
    ): Promise<Post> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/posts`,
          {
            method: "POST",
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
            "Unable to create post",
          );
        }

        return result.data.post;
      } catch (error) {
        return handleError(
          error,
          "Unable to create post",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const updatePost = useCallback(
    async (
      id: string,
      data: UpdatePostData,
    ): Promise<Post> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/posts/${id}`,
          {
            method: "PUT",
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
            "Unable to update post",
          );
        }

        return result.data.post;
      } catch (error) {
        return handleError(
          error,
          "Unable to update post",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const deletePost = useCallback(
    async (
      id: string,
      author: string,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/posts/${id}`,
          {
            method: "DELETE",
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              author,
            }),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
            "Unable to delete post",
          );
        }
      } catch (error) {
        handleError(
          error,
          "Unable to delete post",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <PostContext.Provider
      value={{
        posts,
        pagination,
        isLoading,
        error,
        getAllPosts,
        getPopularPosts,
        getFeedPosts,
        getPost,
        createPost,
        updatePost,
        deletePost,
        clearError,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}