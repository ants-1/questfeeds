import { Comment, IComment } from "../models/Comment";
import { IPost, Post } from "../models/Post";
import User, { IUser } from "../models/User";
import { AppError } from "../utils/AppError";
import { gainExperience } from "../utils/levelSystem";

const createComment = async (
  postId: string,
  content: string,
  author: string,
) => {
  const user: IUser | null = await User.findById(author);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const post: IPost | null = await Post.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const newComment: IComment | null = await Comment.create({
    content,
    author,
  });

  post.comments?.push(newComment._id);

  const levelInfo = gainExperience("comment", user);

  await Promise.all([post.save(), user.save()]);

  const populatedComment = await Comment.findById(newComment._id).populate(
    "author",
    "username avatar",
  );

  return {
    comment: populatedComment,
    levelInfo,
    message: "Comment successfully created",
  };
};

const updateComment = async (
  postId: string,
  commentId: string,
  content: string,
  author: string,
) => {
  const user: IUser | null = await User.findById(author);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const post: IPost | null = await Post.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const comment: IComment | null = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.author.toString() !== author) {
    throw new AppError(
      "Unable to update comment. You are not the author of the comment",
      403,
    );
  }

  if (!post.comments?.some((id) => id.toString() === commentId)) {
    throw new AppError("Comment does not belong to this post", 404);
  }

  const updatedComment: IComment | null = await Comment.findByIdAndUpdate(
    commentId,
    { content },
    { new: true },
  ).populate("author", "username avatar");

  return {
    comment: updatedComment,
    message: "Comment successfully updated",
  };
};

const deleteComment = async (
  postId: string,
  commentId: string,
  author: string,
) => {
  const user: IUser | null = await User.findById(author);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const post: IPost | null = await Post.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (!post.comments?.some((id) => id.toString() === commentId)) {
    throw new AppError("Comment does not belong to this post", 404);
  }

  const comment: IComment | null = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.author.toString() !== author) {
    throw new AppError(
      "Unable to delete comment. You are not the author of the comment",
      403,
    );
  }

  await Comment.findByIdAndDelete(commentId);

  post.comments = post.comments?.filter((id) => id.toString() !== commentId);
  await post.save();

  return {
    message: "Comment successfully deleted",
  };
};

export default {
  createComment,
  updateComment,
  deleteComment,
};
