import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default async function page() {
    return (
        <div className='flex bg-background gap-5 w-full'>
            <div>
                Hey there
            </div>
            <ModeToggle />
            <Button>Click me</Button>
        </div>
    )
}
