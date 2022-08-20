import { DocumentTextIcon } from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import dirTree from "directory-tree";
import fs from "fs";
import matter from "gray-matter";
import lunr from "lunr";
import { NextSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import { useRouter } from "next/router";
import path from "path";
import { useState } from "react";
import recursive from "recursive-readdir";
import "../assets/styles/output.css";
import { NavBar } from "../components/NavBar";
import MarkbaseFavicon from "../public/favicon-512x512.png";
import { environment } from "../utils/environment";
import { SearchableDocument } from "../utils/types";
const removeMd = require("remove-markdown");

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<lunr.Index.Result[]>([]);
  const searchIndex = lunr(function () {
    this.ref("url");
    this.field("name");
    this.field("content");

    for (const document of pageProps.documentList) {
      this.add(document);
    }
  });

  const goToPage = (pageUrl: string) => {
    router.push("/" + pageUrl).then(() => {
      setSearchQuery("");
    });
  };

  const search = (query: string) => {
    setSearchQuery(query);
    setSearchResults(searchIndex.search(query));
  };

  return (
    <ThemeProvider attribute="class" enableSystem={true}>
      <div className="flex md:flex-row flex-col">
        <NavBar onSearch={search} directoryTree={pageProps.directoryTree} />
        <div className="w-full md:w-3/4 pl-0 md:pl-4">
          <div style={{ wordBreak: "break-word" }} className="max-w-7xl px-6">
            {searchQuery !== "" ? (
              searchResults.length > 0 ? (
                <div className="py-4 md:py-16">
                  <NextSeo
                    title={"Search - " + environment.NEXT_PUBLIC_PROJECT_NAME}
                  />
                  <h2 className="text-gray-900 dark:text-gray-200 text-xl font-bold truncate items-center flex flex-row">
                    <SearchIcon className="h-5 w-5 inline" />
                    <span className="ml-2">Search Results</span>
                  </h2>
                  <hr className="invisible sm:visible w-full border border-neutral-200 dark:border-neutral-600 my-4" />
                  <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {searchResults.map((result, i) => (
                      <li
                        onClick={() => goToPage(result.ref)}
                        key={i}
                        className="col-span-1 bg-white hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg shadow divide-y divide-gray-200 cursor-pointer text-gray-700 dark:bg-neutral-800 dark:text-gray-400"
                      >
                        <div className="w-full flex items-center justify-between p-6 space-x-6">
                          <div className="flex-1 truncate">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-gray-900 dark:text-gray-200 text-md font-medium truncate flex flex-row items-center">
                                <DocumentTextIcon className="h-5 w-5" />
                                <span className="ml-1">
                                  {
                                    (
                                      pageProps.documentList as SearchableDocument[]
                                    ).filter((d) => d.url === result.ref)[0]
                                      .name
                                  }
                                </span>
                              </h3>
                            </div>
                            <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm truncate">
                              {removeMd(
                                (
                                  pageProps.documentList as SearchableDocument[]
                                ).filter((d) => d.url === result.ref)[0].content
                              ).substring(0, 50) + "..."}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="py-4 md:py-16">
                  <NextSeo
                    title={"Search - " + environment.NEXT_PUBLIC_PROJECT_NAME}
                  />
                  <h2 className="text-gray-900 dark:text-gray-200 text-xl font-bold truncate items-center flex flex-row">
                    <SearchIcon className="h-5 w-5 inline" />
                    <span className="ml-2">Search Results</span>
                  </h2>
                  <hr className="w-full border border-neutral-200 dark:border-neutral-600 my-4" />
                  <p>No results could be found.</p>
                </div>
              )
            ) : (
              <Component {...pageProps} />
            )}
          </div>
        </div>
      </div>
      <div className="hidden sm:block sm:fixed sm:bottom-5 sm:right-5">
        <a
          href="https://markbase.xyz"
          className="px-3 py-2 rounded-md text-xs font-medium bg-black dark:bg-gray-100 dark:text-gray-800 text-white w-fit flex items-center opacity-80 hover:opacity-100 cursor-pointer shadow-lg"
        >
          <img className="h-5 w-5" src={MarkbaseFavicon.src} />
          <span className="ml-1">Made with Markbase</span>
        </a>
      </div>
    </ThemeProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  appProps.pageProps.documentList = [] as SearchableDocument[];

  appProps.pageProps.directoryTree = dirTree(path.resolve("content"), {
    extensions: /\.md/,
  });

  const files = await recursive(path.resolve("content"));
  for (const file of files) {
    if (file.endsWith(".md")) {
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

      let content = fs.readFileSync(path.resolve(file), "utf-8");

      try {
        let matterContent = matter(content, {});

        appProps.pageProps.documentList.push({
          name: fileName.replace(".md", ""),
          url: postPath,
          content: matterContent.content,
        });
      } catch (error) {
        console.error("Error in getInitialProps - ", error);
        appProps.pageProps.documentList.push({
          name: fileName.replace(".md", ""),
          url: postPath,
          content: content,
        });
      }
    }
  }

  return { ...appProps };
};

export default MyApp;
