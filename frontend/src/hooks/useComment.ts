import { CommentContext } from "@/context/CommentContext";
import { useContext } from "react";

export function useComment() {
  const context = useContext(CommentContext);

  if (!context) {
    throw new Error(
      "useComment must be used within a CommentProvider",
    );
  }

  return context;
}