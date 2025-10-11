import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { Button } from '@/components/ui/button'
import { PlusCircle, SearchIcon } from 'lucide-react'

export default function DashboardHeader() {
    return (
        <div className='flex items-center justify-between w-full max-w-7xl mx-auto p-5'>
            <InputGroup className="max-w-md">
                <InputGroupInput placeholder="Search..." />
                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>
            </InputGroup>
            <div className='bg-foreground/10 rounded-xl p-1'>
                <Button size={"lg"} className='flex items-center bg-blue-600 border text-white'>
                    <div className='bg-foreground/20 p-0.5 text-blue-600 rounded-full'>
                        <PlusCircle fill='#fff' className='stroke-2' />
                    </div>
                    <h4>
                        New Arena
                    </h4>
                </Button>
            </div>
        </div>
    )
}
