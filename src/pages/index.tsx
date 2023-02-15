import Head from "next/head";
import Header from "@/components/Header";
import Session from "@/components/Session";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  return (
    <>
      <Head>
        <title>DaCoolBot Portal</title>
        <meta name="description" content="idk what i'm doing" />
        <meta name="og:url" content="https://dacoolbot.kyrie25.me/" />
        <meta name="og:title" content="DaCoolBot Portal" />
        <meta name="og:image" content="/icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col h-screen items-center">
        <Toaster />
        <Header setTheme={setTheme} />
        <Session theme={theme} />
      </main>
    </>
  );
}
