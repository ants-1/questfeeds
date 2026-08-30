import { Post, IPost } from "../models/Post";
import User, { IUser } from "../models/User";
import { AppError } from "../utils/AppError";
import { redis } from "../config/redis";

const toggleLikes = async (postId: string, userId: string) => {
  const user: IUser | null = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const post: IPost | null = await Post.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const alreadyLiked = post.likes?.some(
    (id) => id.toString() === user._id.toString(),
  );

  if (alreadyLiked) {
    // Remove like
    post.likes = post.likes?.filter(
      (id) => id.toString() !== user._id.toString(),
    );
  } else {
    // Add like
    post.likes?.push(user._id);

    // Remove existing dislike
    post.dislikes = post.dislikes?.filter((id) => id.toString() !== userId);
  }

  await post.save();

  // Update likes if popular post cache exists
  const popularPostCache = await redis.get("popular_posts");

  if (popularPostCache) {
    const popularPosts = JSON.parse(popularPostCache);

    const index = popularPosts.findIndex(
      (cachedPost: any) => cachedPost._id.toString() === post._id.toString(),
    );

    if (index !== -1) {
      popularPosts[index].likes = post.likes;
      popularPosts[index].likesCount = post.likes?.length ?? 0;

      popularPosts.sort((a: any, b: any) => b.likesCount - a.likesCount);

      await redis.setEx("popular_posts", 300, JSON.stringify(popularPosts));
    }
  }

  return {
    liked: !alreadyLiked,
    likesCount: post.likes?.length ?? 0,
    likes: post.likes,
  };
};

const toggleDislikes = async (postId: string, userId: string) => {
  const user: IUser | null = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }
  const post: IPost | null = await Post.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const alreadyDisliked = post.dislikes?.some((id) => id.toString() === userId);

  if (alreadyDisliked) {
    // Remove dislike
    post.dislikes = post.dislikes?.filter((id) => id.toString() !== userId);
  } else {
    // Add dislike
    post.dislikes?.push(user._id);

    // Remove existing like if present
    post.likes = post.likes?.filter((id) => id.toString() !== userId);
  }

  await post.save();

  // Invalidate popular posts cache
  await redis.del("popular_posts");

  return {
    disliked: !alreadyDisliked,
    dislikesCount: post.dislikes?.length ?? 0,
    dislikes: post.dislikes,
  };
};

export default {
  toggleLikes,
  toggleDislikes,
};
