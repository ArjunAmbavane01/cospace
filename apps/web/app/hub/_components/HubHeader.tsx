"use client"

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { User } from "better-auth";
import CreateArenaForm from "@/components/forms/CreateArenaForm";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Kbd } from '@/components/ui/kbd';
import { SearchIcon } from 'lucide-react';

interface HubHeaderProps {
    user: User;
    setSearchQuery: Dispatch<SetStateAction<string>>;
}

export default function HubHeader({ user, setSearchQuery }: HubHeaderProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {

        const handleSearchShortcut = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus()
            };
        }

        window.addEventListener("keydown", handleSearchShortcut);

        return () => {
            window.removeEventListener("keydown", handleSearchShortcut);
        }
    }, [])

    return (
        <div className='flex flex-col gap-8 py-5 pt-10'>
            <div className='flex flex-col gap-2'>
                <h1>
                    Your Arenas
                </h1>
                <p>
                    Manage your arenas and connect with your team
                </p>
            </div>
            <div className="flex justify-between">
                <InputGroup className="w-md">
                    <InputGroupInput
                        ref={inputRef}
                        placeholder="Search arenas"
                        onChange={(e) => (setSearchQuery(e.target.value.trim()))} />
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
