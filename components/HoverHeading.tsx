import { LinkIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useState } from "react";
import { classNames } from "../utils/misc";

interface HoverHeadingProps {
  text: string;
  level: number;
  link?: any;
}

export function HoverHeading(props: HoverHeadingProps) {
  const [showCopyLinkIcon, setShowCopyLinkIcon] = useState<boolean>(false);
  const [showCopiedSuccess, setShowCopiedSuccess] = useState<boolean>(false);

  const textString = props.text;
  const escapedText = textString.toLowerCase().replace(/[^\w]+/g, "-");
  const HeadingElement = `h${props.level}` as keyof JSX.IntrinsicElements;

  const copyLinkToClipboard = () => {
    if (typeof window !== "undefined") {
      setShowCopiedSuccess(false);
      navigator.clipboard.writeText(
        window.location.origin + window.location.pathname + "#" + escapedText
      );
      setShowCopiedSuccess(true);
      setTimeout(() => setShowCopiedSuccess(false), 2000);
    }
  };

  const getIconClassname = () => {
    switch (props.level) {
      case 1:
        return "h-8";
      case 2:
        return "h-6";
      case 3:
        return "h-5";
      case 4:
        return "h-4";
      case 5:
        return "h-3";
      case 6:
        return "h-2";
      default:
        return "h-5";
    }
  };

  return (
    <>
      <Link href={`#${escapedText}`}>
        {props.link ? (
          <HeadingElement
            id={`${escapedText}`}
            className="items-center cursor-pointer"
            onMouseOver={() => setShowCopyLinkIcon(true)}
            onMouseOut={() => setShowCopyLinkIcon(false)}
          >
            {props.link}
          </HeadingElement>
        ) : (
          <a
            style={{
              color: "inherit",
              textDecoration: "inherit",
              fontWeight: "inherit",
            }}
            href={"#" + escapedText}
          >
            <HeadingElement
              id={`${escapedText}`}
              className="items-center cursor-pointer opacity-90 hover:opacity-100"
              onMouseOver={() => setShowCopyLinkIcon(true)}
              onMouseOut={() => setShowCopyLinkIcon(false)}
            >
              <span className="flex flex-row items-center">
                <span>{textString}</span>
                <span className="my-auto" onClick={copyLinkToClipboard}>
                  {showCopyLinkIcon && (
                    <LinkIcon
                      className={classNames(
                        "ml-2 opacity-60 hover:opacity-100",
                        getIconClassname()
                      )}
                    />
                  )}
                </span>
              </span>
            </HeadingElement>
          </a>
        )}
      </Link>
      <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-2 pointer-events-none sm:items-start"
      >
        <div className="w-full flex flex-col items-center space-y-2 sm:items-end">
          <div
            className={classNames(
              "transition translate-y-0 hover:translate-y-1 transition-all duration-200 ease-in-out max-w-sm w-full bg-white dark:bg-black shadow-lg rounded-lg pointer-events-auto overflow-hidden",
              showCopiedSuccess ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="px-4 py-1">
              <div className="flex items-center">
                <div className="w-0 flex-1 flex justify-between">
                  <div className="my-2 w-0 flex-1 text-sm font-medium">
                    Link copied to clipboard
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={() => setShowCopiedSuccess(false)}
                    type="button"
                    className="bg-transparent rounded-md inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
