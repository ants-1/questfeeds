import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Send,
  ThumbsDown,
  ThumbsUp,
  Trash2,
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
import { Textarea } from "@/components/ui/textarea";

export default function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    getPost,
    deletePost,
    isLoading,
    error,
    clearError,
  } = usePost();

  const [post, setPost] = useState<
    Awaited<ReturnType<typeof getPost>> | null
  >(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadPost = async () => {
      clearError();

      try {
        const data = await getPost(id);
        setPost(data);
      } catch {
        // Error is handled by PostContext.
      }
    };

    loadPost();
  }, [id, getPost, clearError]);

  const handleDelete = async () => {
    if (!post || !user?._id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await deletePost(post._id, user._id);
      navigate("/posts");
    } catch {
      // Error is handled by PostContext.
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCommentSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    // Comment context has not been implemented yet.
  };

  if (isLoading && !post) {
    return (
      <div className="flex w-full justify-center px-4 py-8">
        <Card className="w-full max-w-2xl">
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Loading post...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex w-full justify-center px-4 py-8">
        <Card className="w-full max-w-2xl">
          <CardContent className="space-y-4 py-8 text-center">
            <p className="text-sm text-destructive">
              {error || "Post not found."}
            </p>

            <Link to="/posts">
              <Button variant="outline">
                <ArrowLeft />
                Back to posts
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const authorId =
    typeof post.author === "string"
      ? post.author
      : post.author._id;

  const isAuthor = user?._id === authorId;

  const authorName =
    typeof post.author === "string"
      ? post.author
      : `@${post.author.username}`;

  const hasLiked = post.likes.some(
    (like) => like._id === user?._id,
  );

  const hasDisliked = post.dislikes.some(
    (dislike) => dislike._id === user?._id,
  );

  return (
    <div className="flex w-full justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        {/* Post */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <CardTitle className="text-2xl">
                  {post.title}
                </CardTitle>

                <CardDescription className="mt-2">
                  {authorName}
                </CardDescription>
              </div>

              {isAuthor && (
                <div className="flex shrink-0 gap-2">
                  <Link
                    to={`/posts/edit/${post._id}`}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="Edit post"
                    >
                      <Pencil />
                    </Button>
                  </Link>

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    aria-label="Delete post"
                    disabled={isDeleting}
                    onClick={handleDelete}
                  >
                    <Trash2 />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {post.featureImg && (
              <img
                src={post.featureImg}
                alt={post.title}
                className="w-full rounded-lg object-cover"
              />
            )}

            <p className="whitespace-pre-wrap leading-7">
              {post.content}
            </p>

            {/* Like / Dislike */}
            <div className="flex items-center gap-2 border-t pt-4">
              <Button
                type="button"
                variant={
                  hasLiked ? "default" : "outline"
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

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {post.comments.length} comments
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>

            <CardDescription>
              Join the conversation.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Comment form */}
            <form
              onSubmit={handleCommentSubmit}
              className="space-y-3"
            >
              <Textarea
                value={comment}
                onChange={(event) =>
                  setComment(event.target.value)
                }
                placeholder="Write a comment..."
                className="min-h-24 resize-y"
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!comment.trim()}
                >
                  <Send />
                  Add comment
                </Button>
              </div>
            </form>

            {/* Existing comments */}
            {post.comments.length === 0 ? (
              <div className="border-t pt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No comments yet. Be the first to
                  comment.
                </p>
              </div>
            ) : (
              <div className="space-y-4 border-t pt-6">
                {post.comments.map(
                  (comment, index) => (
                    <div
                      key={index}
                      className="rounded-lg border p-4"
                    >
                      <p className="text-sm">
                        {typeof comment === "string"
                          ? comment
                          : "Comment"}
                      </p>
                    </div>
                  ),
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back */}
        <div>
          <Link to="/posts">
            <Button
              type="button"
              variant="outline"
            >
              <ArrowLeft />
              Back to posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}