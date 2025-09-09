import Header from "@/components/Header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 text-center gap-20">
        <div className="max-w-4xl space-y-8 relative">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br
          from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-20 dark:to-purple-950/20 rounded-3xl blur-3xl scale-150 opacity-60"></div>
        </div>
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
            Connect Instantly,
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              Anytime and Anywhere.
            </span>
          </h1>
          <p>
            The modern messaging platform that combines lighting-fast chat and crystal clear video calls in one seamless experience.
          </p>
        </div>
      </main>
    </div>
  );
}
