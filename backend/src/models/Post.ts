import { Schema, model, Document, Types } from "mongoose";

export interface IPost extends Document {
  title: string;
  content?: string;
  featureImg?: string;
  author: Types.ObjectId;
  comments?: Types.ObjectId[];
  likes?: Types.ObjectId[];
  dislikes?: Types.ObjectId[];
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 255,
    },
    content: {
      type: String,
      required: true,
      minLength: 10,
    },
    featureImg: {
      type: String,
      default: "",
    },
    author: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: Types.ObjectId,
        ref: "Comment",
        default: [],
      },
    ],
    likes: [
      {
        type: Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    dislikes: [
      {
        type: Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Post = model<IPost>("Post", postSchema);
