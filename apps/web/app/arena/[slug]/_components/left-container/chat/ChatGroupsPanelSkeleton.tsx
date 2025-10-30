import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatGroupsPanelSkeleton() {
    return (
        <div className="flex flex-col gap-8 w-72 p-3 bg-accent rounded-xl">
            <h3>
                Chat
            </h3>
            <InputGroup className="border">
                <InputGroupInput
                    disabled={true}
                    placeholder="Search people"
                />
                <InputGroupAddon align={"inline-end"}>
                    <Kbd>Ctrl</Kbd><Kbd>F</Kbd>
                </InputGroupAddon>
            </InputGroup>
            <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, idx) => {
                    return <div key={idx} className="flex items-center gap-2 w-full p-3">
                        <Skeleton className="bg-muted-foreground/20 size-9 shrink-0 rounded-full" />
                        <div className="flex flex-col gap-2 w-full">
                            <div className="flex justify-between items-center w-full">
                                <Skeleton className="bg-muted-foreground/20 h-4 w-1/3" />
                                <Skeleton className="bg-muted-foreground/20 h-3 w-10" />
                            </div>
                            <Skeleton className="bg-muted-foreground/20 h-3 w-2/3" />
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}
