"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ArenaNotFound() {
    const router = useRouter();
    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="relative z-10 flex flex-col justify-center min-h-screen px-8 md:px-16 lg:px-24">
                <div className="flex flex-col gap-5 w-full max-w-2xl">
                    <div className="inline-flex items-center gap-2">
                        <div className="size-2 bg-destructive rounded-full animate-pulse" />
                        <p className="text-destructive">
                            ERROR
                        </p>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-light">
                        Arena Not Found
                    </h1>
                    <h4 className="max-w-lg">
                        The arena link you entered is invalid. Please check the link or create a new arena.
                    </h4>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => router.push("/hub")}
                        className="group w-fit"
                    >
                        <span>BACK TO HUB</span>
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </div>
    )
}