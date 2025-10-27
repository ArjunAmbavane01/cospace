import { Skeleton } from "@/components/ui/skeleton";

export default function UserMenuSkeleton() {
    return (
        <div className="flex items-center gap-3 p-2 px-3 rounded-lg">
            <Skeleton className="size-7 rounded-full" />
            <Skeleton className="h-4 w-24" />
        </div>
    )
}