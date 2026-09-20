import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MoreHorizontal,
  Pencil,
  Send,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { usePost } from "@/hooks/usePost";
import { useComment } from "@/hooks/useComment";
import { useReaction } from "@/hooks/useReaction";

import type { Comment } from "@/context/CommentContext";

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
    isLoading: isPostLoading,
    error: postError,
    clearError: clearPostError,
  } = usePost();

  const {
    createComment,
    updateComment,
    deleteComment,
    isLoading: isCommentLoading,
    error: commentError,
    clearError: clearCommentError,
  } = useComment();

  const {
    toggleLike,
    toggleDislike,
    isLoading: isReactionLoading,
    error: reactionError,
    clearError: clearReactionError,
  } = useReaction();

  const [post, setPost] = useState<
    Awaited<ReturnType<typeof getPost>> | null
  >(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const [comment, setComment] = useState("");

  const [openCommentMenu, setOpenCommentMenu] =
    useState<string | null>(null);

  const [editingComment, setEditingComment] =
    useState<string | null>(null);

  const [editCommentContent, setEditCommentContent] =
    useState("");

  useEffect(() => {
    if (!id) return;

    const loadPost = async () => {
      clearPostError();
      clearCommentError();
      clearReactionError();

      try {
        const data = await getPost(id);
        setPost(data);
      } catch {
        // Error is handled by PostContext.
      }
    };

    loadPost();
  }, [
    id,
    getPost,
    clearPostError,
    clearCommentError,
    clearReactionError,
  ]);

  const handleLike = async () => {
    if (!post || !user?._id) return;

    try {
      const result = await toggleLike(post._id);

      setPost((currentPost) => {
        if (!currentPost) return currentPost;

        const userId = user._id;

        if (result.liked) {
          const alreadyLiked = currentPost.likes.some(
            (like) => like._id === userId,
          );

          return {
            ...currentPost,
            likes: alreadyLiked
              ? currentPost.likes
              : [
                  ...currentPost.likes,
                  {
                    _id: userId,
                    username: user.username,
                    avatar: user.avatar,
                  },
                ],
            dislikes: currentPost.dislikes.filter(
              (dislike) => dislike._id !== userId,
            ),
          };
        }

        return {
          ...currentPost,
          likes: currentPost.likes.filter(
            (like) => like._id !== userId,
          ),
        };
      });
    } catch {
      // Error is handled by ReactionContext.
    }
  };

  const handleDislike = async () => {
    if (!post || !user?._id) return;

    try {
      const result = await toggleDislike(post._id);

      setPost((currentPost) => {
        if (!currentPost) return currentPost;

        const userId = user._id;

        if (result.disliked) {
          const alreadyDisliked = currentPost.dislikes.some(
            (dislike) => dislike._id === userId,
          );

          return {
            ...currentPost,
            dislikes: alreadyDisliked
              ? currentPost.dislikes
              : [
                  ...currentPost.dislikes,
                  {
                    _id: userId,
                    username: user.username,
                    avatar: user.avatar,
                  },
                ],
            likes: currentPost.likes.filter(
              (like) => like._id !== userId,
            ),
          };
        }

        return {
          ...currentPost,
          dislikes: currentPost.dislikes.filter(
            (dislike) => dislike._id !== userId,
          ),
        };
      });
    } catch {
      // Error is handled by ReactionContext.
    }
  };

  const handleDeletePost = async () => {
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

  const handleCommentSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!id || !user?._id || !comment.trim()) {
      return;
    }

    try {
      const result = await createComment({
        postId: id,
        content: comment.trim(),
        author: user._id,
      });

      setPost((currentPost) => {
        if (!currentPost) return currentPost;

        return {
          ...currentPost,
          comments: [
            ...currentPost.comments,
            result.comment,
          ],
        };
      });

      setComment("");
    } catch {
      // Error is handled by CommentContext.
    }
  };

  const handleEditComment = async (
    commentItem: Comment,
  ) => {
    if (!id || !user?._id) return;

    const newContent = editCommentContent.trim();

    if (!newContent) return;

    try {
      const result = await updateComment({
        postId: id,
        commentId: commentItem._id,
        content: newContent,
        author: user._id,
      });

      setPost((currentPost) => {
        if (!currentPost) return currentPost;

        return {
          ...currentPost,
          comments: currentPost.comments.map(
            (comment) => {
              if (
                typeof comment !== "object" ||
                comment === null ||
                !("_id" in comment)
              ) {
                return comment;
              }

              if (comment._id === commentItem._id) {
                return result.comment;
              }

              return comment;
            },
          ),
        };
      });

      setEditingComment(null);
      setEditCommentContent("");
      setOpenCommentMenu(null);
    } catch {
      // Error is handled by CommentContext.
    }
  };

  const handleDeleteComment = async (
    commentItem: Comment,
  ) => {
    if (!id || !user?._id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) return;

    try {
      await deleteComment({
        postId: id,
        commentId: commentItem._id,
        author: user._id,
      });

      setPost((currentPost) => {
        if (!currentPost) return currentPost;

        return {
          ...currentPost,
          comments: currentPost.comments.filter(
            (comment) => {
              if (
                typeof comment !== "object" ||
                comment === null ||
                !("_id" in comment)
              ) {
                return true;
              }

              return comment._id !== commentItem._id;
            },
          ),
        };
      });

      setOpenCommentMenu(null);
    } catch {
      // Error is handled by CommentContext.
    }
  };

  const startEditingComment = (
    commentItem: Comment,
  ) => {
    setEditingComment(commentItem._id);
    setEditCommentContent(commentItem.content);
    setOpenCommentMenu(null);
  };

  const cancelEditingComment = () => {
    setEditingComment(null);
    setEditCommentContent("");
  };

  if (isPostLoading && !post) {
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

  if (postError || !post) {
    return (
      <div className="flex w-full justify-center px-4 py-8">
        <Card className="w-full max-w-2xl">
          <CardContent className="space-y-4 py-8 text-center">
            <p className="text-sm text-destructive">
              {postError || "Post not found."}
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
                    onClick={handleDeletePost}
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
                disabled={isReactionLoading}
                onClick={handleLike}
              >
                <ThumbsUp />
                {post.likes.length}
              </Button>

              <Button
                type="button"
                variant={
                  hasDisliked ? "default" : "outline"
                }
                size="sm"
                disabled={isReactionLoading}
                onClick={handleDislike}
              >
                <ThumbsDown />
                {post.dislikes.length}
              </Button>

              <span className="ml-2 text-sm text-muted-foreground">
                {post.comments.length}{" "}
                {post.comments.length === 1
                  ? "comment"
                  : "comments"}
              </span>
            </div>

            {reactionError && (
              <p className="text-sm text-destructive">
                {reactionError}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Comments */}
        <Card className="overflow-visible">
          <CardHeader>
            <CardTitle>Comments</CardTitle>

            <CardDescription>
              Join the conversation.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 overflow-visible">
            {/* Comment error */}
            {commentError && (
              <p className="text-sm text-destructive">
                {commentError}
              </p>
            )}

            {/* Create comment */}
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
                disabled={isCommentLoading}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    !comment.trim() ||
                    isCommentLoading
                  }
                >
                  <Send />
                  {isCommentLoading
                    ? "Adding..."
                    : "Add comment"}
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
              <div className="space-y-4 border-t pt-6 overflow-visible">
                {post.comments.map(
                  (comment, index) => {
                    if (
                      typeof comment !== "object" ||
                      comment === null ||
                      !("_id" in comment)
                    ) {
                      return null;
                    }

                    const commentItem =
                      comment as Comment;

                    const commentAuthorId =
                      typeof commentItem.author ===
                        "string"
                        ? commentItem.author
                        : commentItem.author._id;

                    const commentAuthorName =
                      typeof commentItem.author ===
                        "string"
                        ? commentItem.author
                        : `@${commentItem.author.username}`;

                    const isCommentAuthor =
                      user?._id === commentAuthorId;

                    const isEditing =
                      editingComment ===
                      commentItem._id;

                    const isMenuOpen =
                      openCommentMenu ===
                      commentItem._id;

                    return (
                      <div
                        key={
                          commentItem._id ??
                          index
                        }
                        className={`relative rounded-lg border p-4 ${
                          isMenuOpen
                            ? "z-50"
                            : "z-0"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-sm font-medium">
                              {commentAuthorName}
                            </p>
                          </div>

                          {isCommentAuthor &&
                            !isEditing && (
                              <div className="relative shrink-0">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Comment options"
                                  onClick={() =>
                                    setOpenCommentMenu(
                                      isMenuOpen
                                        ? null
                                        : commentItem._id,
                                    )
                                  }
                                >
                                  <MoreHorizontal />
                                </Button>

                                {isMenuOpen && (
                                  <div className="absolute right-0 top-full z-999 mt-2 w-32 rounded-md border bg-background p-1 shadow-lg">
                                    <button
                                      type="button"
                                      className="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-muted"
                                      onClick={() =>
                                        startEditingComment(
                                          commentItem,
                                        )
                                      }
                                    >
                                      Edit
                                    </button>

                                    <button
                                      type="button"
                                      className="block w-full rounded-sm px-3 py-2 text-left text-sm text-destructive hover:bg-muted"
                                      onClick={() =>
                                        handleDeleteComment(
                                          commentItem,
                                        )
                                      }
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                        </div>

                        {isEditing ? (
                          <div className="mt-3 space-y-3">
                            <Textarea
                              value={
                                editCommentContent
                              }
                              onChange={(event) =>
                                setEditCommentContent(
                                  event.target.value,
                                )
                              }
                              className="min-h-24 resize-y"
                              disabled={
                                isCommentLoading
                              }
                            />

                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={
                                  cancelEditingComment
                                }
                                disabled={
                                  isCommentLoading
                                }
                              >
                                Cancel
                              </Button>

                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  handleEditComment(
                                    commentItem,
                                  )
                                }
                                disabled={
                                  !editCommentContent.trim() ||
                                  isCommentLoading
                                }
                              >
                                {isCommentLoading
                                  ? "Saving..."
                                  : "Save"}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-2 whitespace-pre-wrap text-sm">
                            {commentItem.content}
                          </p>
                        )}
                      </div>
                    );
                  },
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