import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio: string;
  followers?: Types.ObjectId[];
  following?: Types.ObjectId[];

  level: number;
  xp: number;
  totalXp: number;

  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxLength: 256,
      default: "",
    },
    followers: [
      {
        type: Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    level: {
        type: Number,
        default: 1,
    },
    xp: {
        type: Number,
        default: 0,
    },
    totalXp: {
        type: Number,
        default: 0,
    }
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUser>("User", userSchema);