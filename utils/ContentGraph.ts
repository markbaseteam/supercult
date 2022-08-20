import fs from "fs";
import matter from "gray-matter";
import path from "path";
import recursive from "recursive-readdir";
import { DeepPost, Post } from "./types";
const markdownLinkExtractor = require("markdown-link-extractor");

class ContentGraph {
  posts: Post[];

  constructor() {
    this.posts = [];
    recursive(path.resolve("content")).then((files) => {
      for (const file of files) {
        if (file.endsWith(".md")) {
          try {
            let postPath = file.split(path.resolve(""))[1];
            let fileName = file.replace(/\\/g, "/").split("/")[
              file.replace(/\\/g, "/").split("/").length - 1
            ];

            postPath = postPath
              .replace(/\\/g, "/")
              .split("/")
              .map((p) => encodeURIComponent(p))
              .join("/");

            postPath = postPath.replace(/.md/g, "").replace("content/", "");

            if (postPath.startsWith("/") || postPath.startsWith("\\")) {
              postPath = postPath.substring(1);
            }

            const mdFile = fs.readFileSync(path.resolve(file), "utf-8");
            const links = markdownLinkExtractor(mdFile);

            let absoluteLinks = [] as string[];
            for (const link of links) {
              if ((link as string).endsWith(".md")) {
                const parsedPostLink = this.parsePostLink(
                  postPath,
                  link.replace(/.md/g, "")
                );
                if (parsedPostLink !== postPath) {
                  absoluteLinks.push(parsedPostLink);
                }
              }
            }

            const post = {
              url: postPath,
              title: fileName.replace(".md", ""),
              content: "",
              links: absoluteLinks,
              backlinks: [],
            } as Post;

            try {
              const md = matter(mdFile, {});
              post.content = md.content;
            } catch (error) {
              post.content = mdFile;
            }

            // Add to ContentGraph
            this.addPost(post);
          } catch (error) {
            console.error(
              `Error adding post ${file} to content graph - `,
              error
            );
          }
        }
      }

      this.updateLinks();
    });
  }

  addPost(post: Post) {
    this.posts.push(post);
  }

  updateLinks() {
    // Go through each post
    for (const post of this.posts) {
      // Go through each link originating from post
      for (const link of post.links) {
        // Find if the link is to another post in the ContentGraph
        const linkedPost = this.getPostByUrl(link);
        // If it is and isn't in that linked post's backlinks:
        if (
          linkedPost &&
          linkedPost.backlinks.filter((b) => b === post.url).length === 0
        ) {
          // Update the linked post's backlinks
          linkedPost.backlinks.push(post.url);
        }
      }
    }
  }

  getPostByUrl(postUrl: string) {
    return this.posts.filter((p) => p.url === postUrl).length > 0
      ? this.posts.filter((p) => p.url === postUrl)[0]
      : null;
  }

  getDeepPostByUrl(postUrl: string) {
    const shallowPost =
      this.posts.filter((p) => p.url === postUrl).length > 0
        ? this.posts.filter((p) => p.url === postUrl)[0]
        : null;

    if (shallowPost) {
      let deepPostLinks = [] as Post[];
      let deepPostBacklinks = [] as Post[];
      for (const link of shallowPost.links) {
        const linkedPost = this.getPostByUrl(link);
        if (linkedPost) {
          deepPostLinks.push(linkedPost);
        }
      }

      for (const backlink of shallowPost.backlinks) {
        const backlinkedPost = this.getPostByUrl(backlink);
        if (backlinkedPost) {
          deepPostBacklinks.push(backlinkedPost);
        }
      }

      return {
        url: shallowPost?.url,
        title: shallowPost?.title,
        content: shallowPost?.content,
        links: deepPostLinks,
        backlinks: deepPostBacklinks,
      } as DeepPost;
    }

    return null;
  }

  parsePostLink = (
    postAbsoluteUrl: string,
    linkRelativeUrl: string
  ): string => {
    if (linkRelativeUrl.substring(0, 2) === "./") {
      const baseUrl = postAbsoluteUrl.split("/").slice(0, -1);
      const urlAddition = linkRelativeUrl.split("/").slice(1);
      return baseUrl.concat(urlAddition).join("/");
    } else if (linkRelativeUrl.substring(0, 3) === "../") {
      let absoluteUrl = "";
      if (postAbsoluteUrl.split("/").length > 2) {
        absoluteUrl = postAbsoluteUrl.split("/").slice(0, -2).join("/");
      }

      let relativeUrl = linkRelativeUrl.split("/")[1];
      if (linkRelativeUrl.split("/").length > 2) {
        relativeUrl = linkRelativeUrl.split("/").slice(1).join("/");
      }

      return this.parsePostLink(absoluteUrl, relativeUrl);
    } else if (linkRelativeUrl[0] === "/") {
      return linkRelativeUrl;
    } else {
      let baseUrl = [] as string[];
      if (postAbsoluteUrl.length > 0) {
        baseUrl = postAbsoluteUrl.split("/").slice(0, -1);
      }

      let urlAddition = [linkRelativeUrl];
      if (linkRelativeUrl.split("/").length > 1) {
        urlAddition = linkRelativeUrl.split("/").slice(1);
      }
      return baseUrl.concat(urlAddition).join("/");
    }
  };
}

export default new ContentGraph();
