"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ArenaNotFound() {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="max-w-md w-full bg-card rounded-2xl shadow-lg p-8 text-center">
                <svg
                    className="mx-auto mb-4 h-16 w-16 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                </svg>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Arena Not Found
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    The arena link you entered is invalid. Please check the link or create a new arena.
                </p>
                <div className="flex justify-center gap-3">
                    <Button
                        variant={"outline"}
                        size={"sm"}
                        onClick={() => router.push("/hub")}
                        className="flex items-center group transition-all duration-200"
                    >
                        <div className="w-0 overflow-hidden group-hover:w-4 transition-all duration-200 ease-in-out">
                            <ArrowLeft />
                        </div>
                        <span className="transition-all duration-200">Go Back</span>
                    </Button>
                </div>
            </div>
        </div>

    )
}
