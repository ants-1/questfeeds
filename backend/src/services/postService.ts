import { redis } from "../config/redis";
import { Post, IPost } from "../models/Post";
import User, { IUser } from "../models/User";
import { AppError } from "../utils/AppError";

const getAllPosts = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
) => {
  const skip: number = (page - 1) * limit;
  const filter = search ? { title: { $regex: search, $options: "i" } } : {};

  const posts: IPost[] | null = await Post.find(filter)
    .populate("author", "username avatar")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "username avatar",
      },
    })
    .populate("likes", "username avatar")
    .populate("dislikes", "username avatar")
    .skip(skip)
    .limit(limit);

  const total: number = await Post.countDocuments(filter);

  return {
    posts,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const getPopularPosts = async () => {
  const cacheKey = "popular_posts";

  // Check cache first
  const cachedPosts = await redis.get(cacheKey);

  if (cachedPosts) {
    return JSON.parse(cachedPosts);
  }

  console.log("Cache missed");

  const popularPosts = await Post.aggregate([
    {
      $addFields: {
        likesCount: { $size: "$likes" },
      },
    },
    {
      $sort: {
        likesCount: -1,
        createdAt: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);

  await Post.populate(popularPosts, [
    { path: "author", select: "username avatar" },
    { path: "likes", select: "username avatar" },
    { path: "dislikes", select: "username avatar" },
    { path: "comments", select: "username avatar" },
  ]);

  // Cache for 5 minutes
  await redis.setEx(cacheKey, 300, JSON.stringify(popularPosts));

  return popularPosts;
};

const getFeedPosts = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
  search?: string,
) => {
  const user: IUser | null = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const skip: number = (page - 1) * limit;
  const filter = search
    ? {
        author: { $in: user.followings },
        title: { $regex: search, $options: "i" },
      }
    : {};

  // Find all posts that of the users followings
  const feedPosts: IPost[] | null = await Post.find(filter)
    .populate("author", "username avatar")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "username avatar",
      },
    })
    .populate("likes", "username avatar")
    .populate("dislikes", "username avatar")
    .skip(skip)
    .limit(limit);

  const total: number = await Post.countDocuments(filter);

  return {
    posts: feedPosts,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const getPost = async (id: string) => {
  const post: IPost | null = await Post.findById(id)
    .populate("author", "username avatar")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "username avatar",
      },
    })
    .populate("likes", "username avatar")
    .populate("dislikes", "username avatar");

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  return {
    post,
  };
};

const createPost = async (
  title: string,
  content: string,
  author: string,
  featureImg?: string,
) => {
  const user: IUser | null = await User.findById(author);

  if (!user) {
    throw new AppError("Unable to create Post. User not found.", 404);
  }

  const newPost = await Post.create({ title, content, featureImg, author });

  return {
    post: newPost,
  };
};

const updatePost = async (
  id: string,
  author: string,
  title?: string,
  content?: string,
  featureImg?: string,
) => {
  const user: IUser | null = await User.findById(author);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const post: IPost | null = await Post.findById(id);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (post.author.toString() !== author) {
    throw new AppError(
      "Unable to update post. You are not the author of the post",
      403,
    );
  }

  const updatedPost: IPost | null = await Post.findByIdAndUpdate(
    id,
    {
      title,
      content,
      featureImg,
    },
    { new: true },
  );

  return {
    post: updatedPost,
    message: "Post successfully updated",
  };
};

const deletePost = async (id: string, author: string) => {
  const user: IUser | null = await User.findById(author);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const post: IPost | null = await Post.findById(id);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (post.author.toString() == author) {
    throw new AppError(
      "Unable to delete post. You are not the author of the post",
      403,
    );
  }

  await Post.findByIdAndDelete(id);

  return {
    message: "Post has been successfully deleted",
  };
};

export default {
  getAllPosts,
  getPopularPost: getPopularPosts,
  getFeedPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
