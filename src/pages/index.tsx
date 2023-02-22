import Head from "next/head";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Session from "@/components/Session";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={theme === "dark" ? "#334155" : "#ffffff"}
        />
      </Head>
      <main className="flex flex-col justify-between h-screen items-center relative">
        <Toaster />
        <Header setTheme={setTheme} />
        <Session theme={theme} />
        <Footer />
      </main>
    </>
  );
}
