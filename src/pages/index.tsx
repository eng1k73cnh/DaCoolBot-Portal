import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Session from "@/components/Session";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  return (
    <main className="flex flex-col h-screen items-center relative">
      <Toaster />
      <Header setTheme={setTheme} />
      <Session theme={theme} />
      <Footer />
    </main>
  );
}
