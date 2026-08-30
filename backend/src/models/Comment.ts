import { Schema, model, Document, Types } from "mongoose";

export interface IComment extends Document {
  content: string;
  author: Types.ObjectId;
  likes?: Types.ObjectId[];
  dislikes?: Types.ObjectId[];
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      minLength: 3,
    },
    author: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
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

export const CommentModel = model<IComment>("Comment", commentSchema);
