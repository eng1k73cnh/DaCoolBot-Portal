import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>DaCoolBot Portal</title>
        <meta name="description" content="Web portal for DaCoolBot" />
        <meta name="og:type" content="website" />
        <meta name="og:url" content="https://dacoolbot.kyrie25.me/" />
        <meta name="og:title" content="DaCoolBot Portal" />
        <meta name="og:image" content="/icon.png" />
        <meta content="summary" name="twitter:card" />
        <meta content="dacoolbot.kyrie25.me" name="twitter:site" />
        <meta content="DaCoolBot Portal" name="twitter:title" />
        <meta content="Web portal for DaCoolBot" name="twitter:description" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          sizes="180x180"
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
