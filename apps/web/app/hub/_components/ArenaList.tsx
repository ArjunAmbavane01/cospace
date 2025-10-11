import { EllipsisVertical, UserCircle2, Users2 } from "lucide-react";
import Image from "next/image";

export default function ArenaList() {
    const arenas = [1, 1, 1, 1];
    return (
        <div className="grid grid-cols-4 gap-10 w-full max-w-7xl mx-auto">
            {arenas.map((arena, idx) => {
                return (
                    <div key={idx} className="flex flex-col gap-3 bg-muted/60 w-72 h-64 p-2 rounded-lg border shadow-xs shadow-muted-foreground relative overflow-hidden group">
                       <div className="p-1 rounded-xl bg-foreground/10">
                         <div className="w-full h-40 rounded-lg border relative overflow-hidden z-10">
                            <div className="absolute top-2 left-2 flex items-center gap-2 p-1 px-2 bg-muted/80 group-hover:bg-muted rounded-full z-20">
                                <Users2 size={12} />
                                <h6>2</h6>
                            </div>
                            <div className="opacity-0 absolute top-2 right-2 group-hover:opacity-100 flex items-center gap-2 p-1 bg-muted rounded cursor-pointer transition-opacity duration-200 z-20">
                                <EllipsisVertical size={16} />
                            </div>
                            <Image
                                src={"/assets/arena-placeholder.png"}
                                alt="Arena placeholder"
                                fill
                                className="object-cover"
                            />
                        </div>
                       </div>
                        <div className="flex justify-between items-center h-12 p-3">
                            <h5 className="flex items-center gap-1">
                                <UserCircle2 size={16} /> Arjun
                            </h5>
                            <h5>
                                today
                            </h5>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
