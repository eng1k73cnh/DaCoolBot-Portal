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
        <meta name="description" content="idk what i'm doing" />
        <meta name="og:type" content="website" />
        <meta name="og:url" content="https://dacoolbot.kyrie25.me/" />
        <meta name="og:title" content="DaCoolBot Portal" />
        <meta name="og:image" content="/icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
