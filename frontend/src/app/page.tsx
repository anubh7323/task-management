import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">

      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />

      <div className="relative z-10 space-y-8 max-w-2xl">
        <h1 className="text-6xl font-bold tracking-tighter bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">
          Master Your Day.
        </h1>
        <p className="text-xl text-gray-400">
          A premium task management experience for professionals who value focus and aesthetics.
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="rounded-full px-8">
              Get Started <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="rounded-full px-8">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
