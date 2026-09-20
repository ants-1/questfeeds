import { useContext } from "react";

import { ReactionContext } from "@/context/ReactionContext";

export function useReaction() {
  const context = useContext(ReactionContext);

  if (!context) {
    throw new Error(
      "useReaction must be used within a ReactionProvider",
    );
  }

  return context;
}