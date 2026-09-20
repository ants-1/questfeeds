import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MoreHorizontal,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { usePost } from "@/hooks/usePost";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type PostView = "all" | "popular" | "feed";

export default function Posts() {
  const { user } = useAuth();

  const {
    posts,
    pagination,
    isLoading,
    error,
    getAllPosts,
    getPopularPosts,
    getFeedPosts,
    deletePost,
    clearError,
  } = usePost();

  const [view, setView] =
    useState<PostView>("all");

  const [search, setSearch] =
    useState("");

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [openMenu, setOpenMenu] =
    useState<string | null>(null);

  const [isDeleting, setIsDeleting] =
    useState<string | null>(null);

  const limit = 10;

  /*
   * Debounce search input
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /*
   * Reset page when search changes
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  /*
   * Load posts
   */
  useEffect(() => {
    if (!user?._id) return;

    const loadPosts = async () => {
      clearError();

      try {
        switch (view) {
          case "all":
            await getAllPosts({
              page: currentPage,
              limit,
              search: debouncedSearch,
            });
            break;

          case "popular":
            await getPopularPosts();
            break;

          case "feed":
            await getFeedPosts(user._id, {
              page: currentPage,
              limit,
              search: debouncedSearch,
            });
            break;
        }
      } catch {
        // Error is handled by PostContext.
      }
    };

    loadPosts();
  }, [
    view,
    user?._id,
    currentPage,
    debouncedSearch,
    getAllPosts,
    getPopularPosts,
    getFeedPosts,
    clearError,
  ]);

  /*
   * Change post view
   */
  const handleViewChange = (
    newView: PostView,
  ) => {
    if (view === newView) return;

    setSearch("");
    setDebouncedSearch("");
    setCurrentPage(1);
    setOpenMenu(null);
    setView(newView);
  };

  /*
   * Delete post
   */
  const handleDelete = async (
    postId: string,
  ) => {
    if (!user?._id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) return;

    setIsDeleting(postId);

    try {
      await deletePost(postId, user._id);
      setOpenMenu(null);

      if (view === "all") {
        await getAllPosts({
          page: currentPage,
          limit,
          search: debouncedSearch,
        });
      } else if (view === "feed") {
        await getFeedPosts(user._id, {
          page: currentPage,
          limit,
          search: debouncedSearch,
        });
      } else {
        await getPopularPosts();
      }
    } catch {
      // Error is handled by PostContext.
    } finally {
      setIsDeleting(null);
    }
  };

  /*
   * Previous page
   */
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(
        (page) => page - 1,
      );
    }
  };

  /*
   * Next page
   */
  const handleNextPage = () => {
    if (
      pagination &&
      currentPage < pagination.pages
    ) {
      setCurrentPage(
        (page) => page + 1,
      );
    }
  };

  /*
   * Page title
   */
  const getTitle = () => {
    switch (view) {
      case "popular":
        return "Popular posts";

      case "feed":
        return "Following";

      default:
        return "All posts";
    }
  };

  /*
   * Page description
   */
  const getDescription = () => {
    switch (view) {
      case "popular":
        return "See the most popular posts on Questfeeds.";

      case "feed":
        return "See posts from people you follow.";

      default:
        return "Discover the latest posts on Questfeeds.";
    }
  };

  return (
    <div className="flex w-full justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">

        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle>
              Posts
            </CardTitle>

            <CardDescription>
              {getDescription()}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* Search */}
            <div>
              <Input
                type="search"
                placeholder="Search posts..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
              />
            </div>

            {/* Post filters */}
            <div className="flex items-center gap-2">

              <Button
                type="button"
                variant={
                  view === "all"
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  handleViewChange("all")
                }
              >
                All
              </Button>

              <Button
                type="button"
                variant={
                  view === "popular"
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  handleViewChange(
                    "popular",
                  )
                }
              >
                Popular
              </Button>

              <Button
                type="button"
                variant={
                  view === "feed"
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  handleViewChange(
                    "feed",
                  )
                }
              >
                Following
              </Button>

              {/* Create Post */}
              <Link
                to="/posts/create"
                className="ml-auto"
              >
                <Button type="button">
                  Create Post
                </Button>
              </Link>

            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">
                {error}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Posts */}
        <div className="space-y-4">

          {/* Heading */}
          <div>
            <h2 className="text-xl font-semibold">
              {getTitle()}
            </h2>

            {pagination && (
              <p className="text-sm text-muted-foreground">
                {pagination.total}{" "}
                {pagination.total === 1
                  ? "post"
                  : "posts"}
              </p>
            )}
          </div>

          {/* Loading */}
          {isLoading ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Loading posts...
                </p>
              </CardContent>
            </Card>
          ) : posts.length === 0 ? (

            /* No posts */
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No posts found.
                </p>
              </CardContent>
            </Card>

          ) : (

            /* Posts list */
            posts.map((post) => {
              const authorId =
                typeof post.author === "string"
                  ? post.author
                  : post.author._id;

              const isAuthor =
                user?._id === authorId;

              const isMenuOpen =
                openMenu === post._id;

              const isPostDeleting =
                isDeleting === post._id;

              const hasLiked =
                post.likes.some(
                  (like) =>
                    like._id === user?._id,
                );

              const hasDisliked =
                post.dislikes.some(
                  (dislike) =>
                    dislike._id === user?._id,
                );

              return (
                <Card key={post._id}>

                  {/* Post header */}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">
                        <CardTitle>
                          {post.title}
                        </CardTitle>

                        <CardDescription>
                          {typeof post.author ===
                            "string"
                            ? post.author
                            : `@${post.author.username}`}
                        </CardDescription>
                      </div>

                      {/* Three dot menu */}
                      {isAuthor && (
                        <div className="relative shrink-0">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setOpenMenu(
                                isMenuOpen
                                  ? null
                                  : post._id,
                              )
                            }
                            aria-label="Post options"
                          >
                            <MoreHorizontal />
                          </Button>

                          {isMenuOpen && (
                            <div className="absolute right-0 z-10 mt-2 w-32 rounded-md border bg-background p-1 shadow-md">

                              <Link
                                to={`/posts/edit/${post._id}`}
                                className="block rounded-sm px-3 py-2 text-sm hover:bg-muted"
                                onClick={() =>
                                  setOpenMenu(null)
                                }
                              >
                                Edit
                              </Link>

                              <button
                                type="button"
                                disabled={
                                  isPostDeleting
                                }
                                className="block w-full rounded-sm px-3 py-2 text-left text-sm text-destructive hover:bg-muted disabled:opacity-50"
                                onClick={() =>
                                  handleDelete(
                                    post._id,
                                  )
                                }
                              >
                                {isPostDeleting
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>

                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </CardHeader>

                  {/* Post content */}
                  <CardContent>
                    <p className="whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {/* Like / Dislike */}
                    <div className="mt-4 flex items-center gap-2">

                      <Button
                        type="button"
                        variant={
                          hasLiked
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                      >
                        <ThumbsUp />
                        {post.likes.length}
                      </Button>

                      <Button
                        type="button"
                        variant={
                          hasDisliked
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                      >
                        <ThumbsDown />
                        {post.dislikes.length}
                      </Button>

                      <span className="text-sm text-muted-foreground">
                        {post.comments.length}{" "}
                        {post.comments.length === 1
                          ? "comment"
                          : "comments"}
                      </span>

                    </div>

                    {/* View Post */}
                    <div className="mt-4 border-t pt-4">
                      <Link
                        to={`/posts/${post._id}`}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                        >
                          View Post
                        </Button>
                      </Link>
                    </div>

                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {pagination &&
          view !== "popular" && (
            <div className="flex items-center justify-center gap-4 border-t pt-6">

              {/* Previous */}
              <Button
                type="button"
                variant="outline"
                disabled={
                  currentPage === 1 ||
                  isLoading
                }
                onClick={
                  handlePreviousPage
                }
              >
                Previous
              </Button>

              {/* Page number */}
              <span className="text-sm font-medium">
                Page {currentPage} of{" "}
                {pagination.pages === 0
                  ? 1
                  : pagination.pages}
              </span>

              {/* Next */}
              <Button
                type="button"
                variant="outline"
                disabled={
                  currentPage >=
                    pagination.pages ||
                  isLoading
                }
                onClick={
                  handleNextPage
                }
              >
                Next
              </Button>

            </div>
          )}

      </div>
    </div>
  );
}