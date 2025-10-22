import { User } from "better-auth";
import CreateArenaForm from "@/components/forms/CreateArenaForm";
import { InputGroup, InputGroupAddon, InputGroupInput, } from "@/components/ui/input-group"
import { Kbd } from '@/components/ui/kbd';
import { SearchIcon } from 'lucide-react';

interface HubHeaderProps {
    user: User;
}

export default async function HubHeader({ user }: HubHeaderProps) {
    const { name: userName } = user
    return (
        <div className='flex flex-col gap-8 py-5 pt-10'>
            <div className='flex flex-col gap-2'>
                <h1>
                    Your Arenas
                </h1>
                {/* <h1>
                        Welcome back, {userName.split(" ")[0]}👋
                    </h1> */}
                <p>
                    Manage your arenas and connect with your team
                </p>
            </div>
            <div className="flex justify-between">
                <InputGroup className="w-md">
                    <InputGroupInput placeholder="Search arenas" />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupAddon align={"inline-end"}>
                        <Kbd>⌘</Kbd><Kbd>K</Kbd>
                    </InputGroupAddon>
                </InputGroup>
                <CreateArenaForm user={user} />
            </div>
        </div>
    )
}
