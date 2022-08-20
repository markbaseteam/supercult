import {
  AnnotationIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  DocumentTextIcon,
  ExclamationIcon,
  FireIcon,
  InformationCircleIcon,
  LightningBoltIcon,
  PencilIcon,
  PuzzleIcon,
  QuestionMarkCircleIcon,
  XIcon,
} from "@heroicons/react/outline";
import Markdown from "marked-react";
import Link from "next/link";
import { ReactElement, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { classNames } from "../utils/misc";
import { HoverHeading } from "./HoverHeading";

interface InternalHoverLinkProps {
  href: string;
  path: string;
  text: string;
  linkedPostContent: string;
}

export function InternalHoverLink(props: InternalHoverLinkProps) {
  const [showInlineLinkPopover, setShowInlineLinkPopover] =
    useState<boolean>(false);

  // Render links
  const renderer = {
    link(href: string, text: string) {
      const splitHref = href.split("#");
      if (
        !splitHref[0].startsWith("https://") &&
        !splitHref[0].startsWith("http://") &&
        splitHref[0].endsWith(".md")
      ) {
        let linkedPostContent = "";
        let mdPath = href;

        return (
          <InternalHoverLink
            href={href}
            path={mdPath}
            linkedPostContent={linkedPostContent}
            text={text[0]}
          />
        );
      } else {
        return (
          <Link key={href} href={href}>
            <span className="text-indigo-400 hover:text-indigo-500 no-underline">
              {text[0]}
            </span>
          </Link>
        );
      }
    },
    table(children: any) {
      return (
        <div className="not-prose relative shadow-md rounded-sm sm:rounded-lg overflow-x-scroll max-w-full scrollbar-thin dark:scrollbar-thumb-black dark:scrollbar-track-dark scrollbar-thumb-gray-400 scrollbar-track-zinc-100 my-4 scrollbar-thumb-rounded-full">
          <table className="table">
            {children[0]}
            {children[1]}
          </table>
        </div>
      ) as ReactElement;
    },
    paragraph(text: string) {
      return <div className="paragraph">{text}</div>;
    },
    html(html: string) {
      return (
        <div
          className="whitespace-normal"
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
      );
    },
    blockquote(quoteBlocks: ReactElement[]) {
      if (quoteBlocks && quoteBlocks.length > 0) {
        try {
          let quote;
          for (const block of quoteBlocks) {
            if (block) {
              quote = block;
            }
          }
          let quoteText: string = "";
          for (const span of quote?.props.children) {
            quoteText += span.props.dangerouslySetInnerHTML.__html;
          }

          if (quoteText) {
            const re = /\[!([^\s#]+)\]/g;
            const match = re.exec(quoteText);
            const filteredQuoteText = quoteText.replace(re, "").trimStart();

            if (match && match.length > 0) {
              const callout = match[1];
              switch (callout.toLowerCase()) {
                case "note":
                  return (
                    <div
                      role="alert"
                      className="my-3 border-l-4 shadow-sm border-blue-500 rounded-md"
                    >
                      <div className="flex flex-row items-center bg-blue-500/30 dark:text-white text-black text-sm font-bold px-4 py-3 rounded-t">
                        <PencilIcon className="h-5 w-5 text-blue-500" />
                        <span className="ml-1">Note</span>
                      </div>
                      <div className="bg-white dark:bg-neutral-800 px-4 py-3 text-black dark:text-white rounded-b">
                        <p className="whitespace-pre-wrap">
                          {filteredQuoteText}
                        </p>
                      </div>
                    </div>
                  ) as ReactElement;
                case "abstract":
                case "summary":
                case "tldr":
                  return (
                    <div
                      role="alert"
                      className="my-3 rounded-md border-l-4 shadow-sm border-sky-500"
                    >
                      <div className="flex flex-row items-center bg-sky-500/30 dark:text-white text-black text-sm font-bold px-4 py-3 rounded-t">
                        <ClipboardListIcon className="h-5 w-5 text-sky-500" />
                        <span className="ml-1">
                          {callout[0].toUpperCase() +
                            callout.substring(1).toLowerCase()}
                        </span>
                      </div>
                      <div className="rounded-b bg-white dark:bg-neutral-800 px-4 py-3 text-black dark:text-white rounded-b">
                        <p className="whitespace-pre-wrap">
                          {filteredQuoteText}
                        </p>
                      </div>
                    </div>
                  ) as ReactElement;
                case "info":
                  return (
                    <div
                      role="alert"
                      className="my-3 rounded-md border-l-4 shadow-sm border-cyan-500"
                    >
                      <div className="flex flex-row items-center bg-cyan-500/30 dark:text-white text-black text-sm font-bold px-4 py-3 rounded-t">
                        <InformationCircleIcon className="h-5 w-5 text-cyan-500" />
                        <span className="ml-1">Info</span>
                      </div>
                      <div className="rounded-b bg-white dark:bg-neutral-800 px-4 py-3 text-black dark:text-white">
                        <p className="whitespace-pre-wrap">
                          {filteredQuoteText}
                        </p>
                      </div>
                    </div>
                  ) as ReactElement;
                case "tip":
                case "hint":
                case "important":
                  return (
                    <div
                      role="alert"
                      className="my-3 rounded-md border-l-4 shadow-sm border-teal-500"
                    >
                      <div className="flex flex-row items-center bg-teal-500/30 dark:text-white text-black text-sm font-bold px-4 py-3 rounded-t">
                        <FireIcon className="h-5 w-5 text-teal-500" />
                        <span className="ml-1">
                          {callout[0].toUpperCase() +
                            callout.substring(1).toLowerCase()}
                        </span>
                      </div>
                      <div className="rounded-b bg-white dark:bg-neutral-800 px-4 py-3 text-black dark:text-white">
                        <p className="whitespace-pre-wrap">
                          {filteredQuoteText}
                        </p>
                      </div>
                    </div>
                  ) as ReactElement;
                case "success":
                case "check":
                case "done":
                  return (
                    <div
                      role="alert"
                      className="my-3 rounded-md border-l-4 shadow-sm border-green-500"
                    >
                      <div className="flex flex-row items-center bg-green-500/30 dark:text-white text-black text-sm font-bold px-4 py-3 rounded-t">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        <span className="ml-1">
                          {callout[0].toUpperCase() +
                            callout.substring(1).toLowerCase()}
                        </span>
                      </div>
                      <div className="rounded-b bg-white dark:bg-neutral-800 px-4 py-3 text-black dark:text-white">
                        <p className="whitespace-pre-wrap">
                          {filteredQuoteText}
                        </p>
                      </div>
                    </div>
                  ) as ReactElement;
                case "question":
                case "help":
                case "faq":
                  return (
                    <div
                      role="alert"
                      className="my-3 rounded-md border-l-4 shadow-sm border-emerald-500"
                    >
                      <div className="flex flex-row items-center bg-emerald-500/30 dark:text-white text-black text-sm font-bold px-4 py-3 rounded-t">
                        <QuestionMarkCircleIcon className="h-5 w-5 text-emerald-500" />
                        <span className="ml-1">
                          {callout[0].toUpperCase() +
                            callout.substring(1).toLowerCase()}
                        </span>
                      </div>
                      <div className="rounded-b bg-white dark:bg-neutral-800 px-4 py-3 text-black dark:text-white">
                        <p className="whitespace-pre-wrap">
                          {filteredQuoteText}
                        </p>
                      </div>
                    </div>
                  ) as ReactElement;
                case "warning":
                case "caution":
                case "attention":
                  return (
                    <div
                      role="alert"
                      className="my-3 rounded-md border-l-4 shadow-sm border-orange-500"
                    >
                      <div className="flex flex-row items-center bg-orange-500/30 dark:text-white text-black text-sm font-bold px-4 py-3 rounded-t">
                        <ExclamationIcon className="h-5 w-5 text-orange-500" />
                        <span className="ml-1">
                          {callout[0].toUpperCase() +
                            callout.substring(1).toLowerCase()}
                        </span>
                      </div>
                      <div className="rounded-b bg-white dark:bg-neutral-800 px-4 py-3 text-black dark:text-white">
                        <p className="whitespace-pre-wrap">
                          {filteredQuoteText}
                        </p>
                      </div>
                    </div>
                  ) as ReactElement;
                case "failure":
                case "fail":
                case "missing":
                  return (
                    <div
                      role="alert"
                      className="my-3 rounded-md border-l-4 shadow-sm border-rose-500"
                    >
                      <div className="flex flex-row items-center bg-rose-500/30 dark:text-white text-black text-sm font-bold px-4 py-3 rounded-t">
                        <XIcon className="h-5 w-5 text-rose-500" />
                        <span className="ml-1">
                          {callout[0].toUpperCase() +
                            callout.substring(1).toLowerCase()}
                        </span>
                      </div>
                      <div className="rounded-b bg-white dark:bg-neutral-800 px-4 py-3 text-black dark:text-white">
                        <p className="whitespace-pre-wrap">
                          {filteredQuoteText}
                        </p>
                      </div>
                    </div>
                  ) as ReactElement;
                case "danger":
                case "error":
                  return (
                    <div
                      role="alert"
                      className="my-3 rounded-md border-l-4 shadow-sm border-red-500"
                    >
                      <div className="flex flex-row items-center bg-red-500/30 dark:text-white text-black text-sm font-bold px-4 py-3 rounded-t">
                        <LightningBoltIcon className="h-5 w-5 text-red-500" />
                        <span className="ml-1">
                          {callout[0].toUpperCase() +
                            callout.substring(1).toLowerCase()}
                        </span>
                      </div>
                      <div className="rounded-b bg-white dark:bg-neutral-800 px-4 py-3 text-black dark:text-white">
                        <p className="whitespace-pre-wrap">
                          {filteredQuoteText}
                        </p>
                      </div>
                    </div>
                  ) as ReactElement;
                case "bug":
                  return (
                    <div
                      role="alert"
                      className="my-3 rounded-md border-l-4 shadow-sm border-pink-500"
                    >
                      <div className="flex flex-row items-center bg-pink-500/30 dark:text-white text-black text-sm font-bold px-4 py-3 rounded-t">
                        <PuzzleIcon className="h-5 w-5 text-pink-500" />
                        <span className="ml-1">
                          {callout[0].toUpperCase() +
                            callout.substring(1).toLowerCase()}
                        </span>
                      </div>
                      <div className="rounded-b bg-white dark:bg-neutral-800 px-4 py-3 text-black dark:text-white">
                        <p className="whitespace-pre-wrap">
                          {filteredQuoteText}
                        </p>
                      </div>
                    </div>
                  ) as ReactElement;
                case "example":
                  return (
                    <div
                      role="alert"
                      className="my-3 rounded-md border-l-4 shadow-sm border-purple-500"
                    >
                      <div className="flex flex-row items-center bg-purple-500/30 dark:text-white text-black text-sm font-bold px-4 py-3 rounded-t">
                        <DocumentTextIcon className="h-5 w-5 text-purple-500" />
                        <span className="ml-1">
                          {callout[0].toUpperCase() +
                            callout.substring(1).toLowerCase()}
                        </span>
                      </div>
                      <div className="rounded-b bg-white dark:bg-neutral-800 px-4 py-3 text-black dark:text-white">
                        <p className="whitespace-pre-wrap">
                          {filteredQuoteText}
                        </p>
                      </div>
                    </div>
                  ) as ReactElement;
                case "quote":
                  return (
                    <div
                      role="alert"
                      className="my-3 rounded-md border-l-4 shadow-sm border-gray-500"
                    >
                      <div className="flex flex-row items-center bg-gray-500/30 dark:text-white text-black text-sm font-bold px-4 py-3 rounded-t">
                        <AnnotationIcon className="h-5 w-5 text-gray-500" />
                        <span className="ml-1">
                          {callout[0].toUpperCase() +
                            callout.substring(1).toLowerCase()}
                        </span>
                      </div>
                      <div className="rounded-b bg-white dark:bg-neutral-800 px-4 py-3 text-black dark:text-white">
                        <p className="whitespace-pre-wrap">
                          {filteredQuoteText}
                        </p>
                      </div>
                    </div>
                  ) as ReactElement;
                default:
                  break;
              }
            }
          }
        } catch (error) {}

        return (
          <div className="my-3 border-l-4 px-4 py-1 border-gray-500 dark:bg-neutral-800 bg-white prose whitespace-pre-wrap dark:prose-invert quote">
            {quoteBlocks}
          </div>
        ) as ReactElement;
      } else {
        return (
          <div className="border-l-4 px-4 my-3 py-1 border-gray-500 dark:bg-neutral-800 bg-white prose whitespace-pre-wrap dark:prose-invert quote">
            {quoteBlocks}
          </div>
        ) as ReactElement;
      }
    },
    text(text: string) {
      const formattedText = text.replace(
        /==([^=]+)==/g,
        `<span class="highlight">$1</span>`
      );
      return (
        <span
          key={text.substring(0, 20)}
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
    },
    code(code: any, language: any) {
      return (
        <SyntaxHighlighter
          className="scrollbar-thin dark:scrollbar-thumb-black scrollbar-track-transparent scrollbar-thumb-gray-400  scrollbar-thumb-rounded-full"
          language={language}
          style={nord}
        >
          {code}
        </SyntaxHighlighter>
      );
    },
    image(href: string, title: string, text: string) {
      return (
        <img src={href} alt={text} className="mt-0 rounded-sm sm:rounded-lg" />
      );
    },
    heading(textBlocks: any, level: number) {
      try {
        let text;
        for (const block of textBlocks) {
          if (block) {
            text = block;
          }
        }
        let textString: string = "";
        textString = text.props.dangerouslySetInnerHTML.__html;
        return <HoverHeading text={textString} level={level} />;
      } catch {
        return textBlocks;
      }
    },
  };

  return (
    <span key={props.href}>
      <Link href={props.path}>
        <span
          onMouseOver={() => setShowInlineLinkPopover(true)}
          onMouseOut={() => setShowInlineLinkPopover(false)}
          className="px-0.5 mx-0.5 mr-1 rounded-sm bg-indigo-200 hover:bg-indigo-300 text-gray-800 hover:text-gray-600 opacity-70 no-underline cursor-pointer"
        >
          {props.text}
        </span>
      </Link>
      <span
        className={classNames(
          "whitespace-normal prose sm:prose-md dark:prose-invert dark:text-gray-300 linkPopup scrollbar-thin dark:scrollbar-thumb-black dark:scrollbar-track-dark scrollbar-thumb-gray-400 scrollbar-track-zinc-100 scrollbar-thumb-rounded-full",
          showInlineLinkPopover && props.linkedPostContent ? "" : "hidden"
        )}
      >
        <Markdown value={props.linkedPostContent} renderer={renderer} />
      </span>
    </span>
  );
}
