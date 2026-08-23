import User, { IUser } from "../models/User";
import { AppError } from "../utils/AppError";

const getAllUsers = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
) => {
  const skip: number = (page - 1) * limit;

  const filter = search ? { username: { $regex: search, $options: "i" } } : {};

  const users: IUser[] | null = await User.find(filter)
    .select("-password")
    .skip(skip)
    .limit(limit);

  const total: number = await User.countDocuments(filter);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const getUser = async (id: string) => {
  const user: IUser | null = await User.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    user,
  };
};

const updateUser = async (
  id: string,
  username?: string,
  email?: string,
  avatar?: string,
  bio?: string,
) => {
  const user: IUser | null = await User.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // update user
  const updatedUser = await User.findByIdAndUpdate(id, {
    username,
    email,
    avatar,
    bio,
  }).select("-password");

  return {
    message: "User successfully updated",
    user: updatedUser
  };
};

const updateUserPassword = async (id: string, oldPassword: string, newPassword: string) => {
  const user: IUser | null = await User.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isValid = user.comparePassword(oldPassword);

  if (!isValid) {
    throw new AppError("Passwords do not match", 401);
  }

  user.password = newPassword;

  await user.save();

  return {
    message: "User's password sucessfully updated"
  }
};

export default { getAllUsers, getUser, updateUser, updateUserPassword };
