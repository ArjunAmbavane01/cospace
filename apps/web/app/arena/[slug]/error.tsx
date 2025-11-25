'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function Error({ error }: { error: Error }) {

    const router = useRouter();

    useEffect(() => {
        console.error(error);
        toast.error(error.message || "Unexpected error occurred");
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
            <h2 className="font-semibold text-destructive">Something went wrong</h2>
            <p>
                We could not load this arena.
            </p>

            <Button
                variant={"ghost"}
                size={"sm"}
                onClick={() => router.push("/hub")}
                className="absolute top-3 left-3 group"
            >
                <div className="w-0 group-hover:w-4 transition-all overflow-hidden">
                    <ArrowLeft />
                </div>
                <span>Go Back</span>
            </Button>
        </div>
    );
}
