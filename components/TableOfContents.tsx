import { HashtagIcon } from "@heroicons/react/solid";
import MarkdownContents from "markdown-contents";
import { useEffect, useState } from "react";
import { TableOfContentsItem } from "./TableOfContentsItem";

interface TableOfContentsProps {
  postContent: string;
}

interface TableOfContentsItem {
  id: string;
  level: number;
  name: string;
}

export function TableOfContents(props: TableOfContentsProps) {
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(
    []
  );
  const [topHeadingLevel, setTopHeadingLevel] = useState<number>(10);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const toc = MarkdownContents(props.postContent).articles();
        findTopHeadingLevel(toc);
        setTableOfContents(toc);
      } catch {}
    }
  }, [props]);

  const findTopHeadingLevel = (tocItems: TableOfContentsItem[]) => {
    let topLevel = 10;
    for (const item of tocItems) {
      if (item.level < topLevel) {
        topLevel = item.level;
      }
    }
    setTopHeadingLevel(topLevel);
  };

  return tableOfContents.length > 0 ? (
    <div
      id="markbase-table-of-contents"
      className="text-left hidden lg:block text-right h-screen sticky top-0 py-4 md:py-16 whitespace-normal prose sm:prose-md dark:prose-invert dark:text-gray-300 "
      style={{ wordBreak: "break-word" }}
    >
      <div className="px-0 md:pl-8 pr-4 border-l-2 dark:border-neutral-600 border-neutral-200 min-h-0 h-full">
        <h2 className="text-xl text-left font-bold mt-0 mb-2 truncate">
          # Table of Contents
        </h2>
        <div
          style={{ maxHeight: "50vh" }}
          className="overflow-y-auto scrollbar-thin dark:scrollbar-thumb-black dark:scrollbar-track-dark scrollbar-thumb-gray-400 scrollbar-track-zinc-100 scrollbar-thumb-rounded-full"
        >
          <div className="text-sm">
            {tableOfContents.map((item, i) => {
              return (
                <TableOfContentsItem
                  id={item.id}
                  level={item.level}
                  topLevel={topHeadingLevel}
                  name={item.name}
                  key={i}
                  selected={
                    typeof window !== "undefined" &&
                    !!window.location.hash &&
                    window.location.hash.startsWith("#") &&
                    window.location.hash.substring(1) === item.name
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
