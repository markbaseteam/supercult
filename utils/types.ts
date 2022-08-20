export type Post = {
  url: string;
  title: string;
  content: string;
  links: string[];
  backlinks: string[];
  metadata?: PostMetadata;
};

export type PostMetadata = {
  title?: string;
  description?: string;
  canonical?: string;
  ogUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogSitename?: string;
  twitterHandle?: string;
  twitterSite?: string;
  twitterCardType?: string;
};

export type DeepPost = {
  url: string;
  title: string;
  content: string;
  links: Post[];
  backlinks: Post[];
  metadata?: PostMetadata;
};

export type SearchableDocument = {
  name: string;
  url: string;
  content: string;
};
