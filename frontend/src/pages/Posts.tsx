import { useEffect, useState } from "react";

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
    clearError,
  } = usePost();

  const [view, setView] = useState<PostView>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Load posts when view or search changes
  useEffect(() => {
    if (!user?._id) return;

    const loadPosts = async () => {
      clearError();

      try {
        switch (view) {
          case "all":
            await getAllPosts({
              page: 1,
              limit: 10,
              search: debouncedSearch,
            });
            break;

          case "popular":
            await getPopularPosts();
            break;

          case "feed":
            await getFeedPosts(user._id, {
              page: 1,
              limit: 10,
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
    debouncedSearch,
    getAllPosts,
    getPopularPosts,
    getFeedPosts,
    clearError,
  ]);

  const handleViewChange = (newView: PostView) => {
    if (view === newView) return;

    setSearch("");
    setView(newView);
  };

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
            <CardTitle>Posts</CardTitle>

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
                  setSearch(event.target.value)
                }
              />
            </div>

            {/* Post filters */}
            <div className="flex flex-wrap gap-2">
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
                  handleViewChange("popular")
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
                  handleViewChange("feed")
                }
              >
                Following
              </Button>
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

          {isLoading ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Loading posts...
                </p>
              </CardContent>
            </Card>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No posts found.
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post._id}>
                <CardHeader>
                  <CardTitle>
                    {post.title}
                  </CardTitle>

                  <CardDescription>
                    {typeof post.author === "string"
                      ? post.author
                      : `@${post.author.username}`}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="whitespace-pre-wrap">
                    {post.content}
                  </p>

                  <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                    <span>
                      {post.likes.length} likes
                    </span>

                    <span>
                      {post.comments.length} comments
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}