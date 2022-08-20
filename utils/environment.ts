export interface Environment {
  NEXT_PUBLIC_PROJECT_URL: string;
  NEXT_PUBLIC_PROJECT_NAME: string;
  NEXT_PUBLIC_SUBSCRIBED: boolean;
}

export const environment: Environment = {
  NEXT_PUBLIC_PROJECT_URL:
    process.env.NEXT_PUBLIC_PROJECT_URL ||
    "https://markbase-template-blog.markbase.xyz",
  NEXT_PUBLIC_PROJECT_NAME:
    process.env.NEXT_PUBLIC_PROJECT_NAME || "Markbase Sample Project",
  NEXT_PUBLIC_SUBSCRIBED:
    process.env.NEXT_PUBLIC_SUBSCRIBED === "true" ? true : false,
};
