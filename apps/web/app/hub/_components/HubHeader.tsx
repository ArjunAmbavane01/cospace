"use client"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Button } from '@/components/ui/button'
import { Plus, PlusCircle, SearchIcon } from 'lucide-react'
import { createArena } from "server/actions/arena/create"
import CustomButton from "@/components/buttons/CustomButton"

export default function HubHeader() {
    return (
        <div className=' w-full max-w-7xl mx-auto py-5'>
            <div>
            </div>
            <div className="flex items-center justify-between">
                <InputGroup className="max-w-md">
                    <InputGroupInput placeholder="Search..." />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
                <CustomButton>
                    <Plus fill='#fff' className='stroke-2' />
                    <h4>
                        Create Arena
                    </h4>
                </CustomButton>
            </div >
        </div >
    )
}
