import { Button } from '@/components/ui/button';

export default function CustomButton({ children }: React.ComponentProps<"button">) {
    return (
        <div className="p-1 bg-foreground/10 group rounded-2xl">
            <Button
                size={"lg"}
                className='p-0.5 h-fit bg-gradient-to-t from-blue-600 to-blue-400 hover:bg-blue-500 border-2 border-blue-800 text-white rounded-xl group-hover:bg-blue-500 relative'>
                <div className="flex items-center gap-1.5 p-1.5 px-3 bg-gradient-to-b from-blue-700 via-blue-600 to-blue-700 rounded-lg">
                    {children}
                </div>
            </Button>
        </div>
    )
}
