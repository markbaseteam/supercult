import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="h-full scroll-smooth">
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon-512x512.png" />
        <script defer src="/custom-head.js" />
      </Head>
      <body className="bg-zinc-100 dark:bg-dark h-full dark:text-white scrollbar-thin dark:scrollbar-thumb-black dark:scrollbar-track-dark scrollbar-thumb-gray-400 scrollbar-track-zinc-100 w-screen scrollbar-thumb-rounded-full">
        <Main />
        <NextScript />
        <script defer src="/custom-body.js" />
      </body>
    </Html>
  );
}
