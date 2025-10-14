export default function ArenaCardSkeleton() {
    return (
        <div className="flex flex-col gap-3 bg-card w-72 h-60 rounded-lg border relative overflow-hidden">
            {/* Image */}
            <div className="w-full h-40 bg-muted animate-pulse"></div>

            {/* Content */}
            <div className="flex flex-col h-20 p-3 space-y-3">
                {/* Title */}
                <div className="w-3/4 h-4 bg-muted rounded animate-pulse"></div>

                {/* details */}
                <div className="flex justify-between items-center">
                    <div className="w-1/2 h-4 bg-muted rounded animate-pulse"></div>
                    <div className="w-1/4 h-4 bg-muted rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}