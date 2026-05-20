export const SUBSCRIPTION_KEY = "summarist-subscription";

export type LocalSubscription = {
  active: boolean;
  plan: "monthly" | "yearly" | "unknown";
  startedAt: string;
};
