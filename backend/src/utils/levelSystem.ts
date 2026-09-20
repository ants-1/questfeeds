import { IUser } from "../models/User";

const XP_REWARDS = {
  post: 10,
  like: 5,
  dislike: 5,
  comment: 5,
} as const;

type XPAction = keyof typeof XP_REWARDS;

const getXpRequired = (level: number): number => {
  return level * 100;
};

const levelSystem = (user: IUser) => {
  while (user.xp >= getXpRequired(user.level)) {
    user.xp -= getXpRequired(user.level);
    user.level++;
  }

  return {
    level: user.level,
    currentXp: user.xp,
    xpForNextLevel: getXpRequired(user.level),
    totalXp: user.totalXp,
  };
};

const gainExperience = (action: XPAction, user: IUser) => {
  const amount = XP_REWARDS[action];

  user.xp += amount;
  user.totalXp += amount;

  return levelSystem(user);
};

export { gainExperience, levelSystem };