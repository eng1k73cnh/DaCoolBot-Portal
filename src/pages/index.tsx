import Head from "next/head";
import Header from "@/components/Header";
import Filter from "@/components/Filter";
import { useState } from "react";

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
        <Header setTheme={setTheme} />
        <Filter theme={theme} />
      </main>
    </>
  );
}
