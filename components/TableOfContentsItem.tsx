import Markdown from "marked-react";
import Link from "next/link";
import { useState } from "react";
import { classNames } from "../utils/misc";

interface TableOfContentsItemProps {
  id: string;
  level: number;
  topLevel: number;
  name: string;
  selected?: boolean;
}

export function TableOfContentsItem(props: TableOfContentsItemProps) {
  const [showLinkIcon, setShowLinkIcon] = useState<boolean>(false);

  // Render links
  const renderer = {
    link(href: string, text: string) {
      return <span>{text}</span>;
    },
    paragraph(text: string) {
      return <span>{text}</span>;
    },
  };

  return (
    <Link href={"#" + props.id}>
      <a
        href={"#" + props.id}
        style={{
          color: "inherit",
          textDecoration: "inherit",
          fontWeight: "inherit",
        }}
      >
        <div
          style={{ marginLeft: `${props.level - props.topLevel}rem` }}
          className={classNames(
            "text-left cursor-pointer hover:text-black dark:hover:text-white py-1 flex flex-row items-center truncate text-gray-500 dark:text-gray-300",
            props.selected
              ? "text-black dark:text-white"
              : "text-gray-500 dark:text-gray-300"
          )}
          onMouseOver={() => setShowLinkIcon(true)}
          onMouseOut={() => setShowLinkIcon(false)}
        >
          <span>
            <Markdown value={props.name} renderer={renderer} />
            <span>
              {showLinkIcon && (
                <span className="ml-1.5 opacity-50 hover:opacity-100">#</span>
              )}
            </span>
          </span>
        </div>
      </a>
    </Link>
  );
}
