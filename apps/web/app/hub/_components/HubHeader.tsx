"use client"

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import CreateArenaDialog from "@/components/forms/CreateArenaDialog";
import JoinArenaDialog from "@/components/forms/JoinArenaDialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Kbd } from '@/components/ui/kbd';
import { SearchIcon } from 'lucide-react';
import { ArenaMutation } from "./HubDashboard";

interface HubHeaderProps {
    setSearchQuery: Dispatch<SetStateAction<string>>;
    joinArena: ArenaMutation;
    isJoining: boolean;
}

export default function HubHeader({ setSearchQuery, joinArena, isJoining }: HubHeaderProps) {

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
                <h4>
                    Manage your arenas and connect with your team
                </h4>
            </div>
            <div className="flex items-center justify-between">
                <InputGroup className="w-md border">
                    <InputGroupInput
                        ref={inputRef}
                        placeholder="Search arenas"
                        onChange={(e) => (setSearchQuery(e.target.value.trim()))}
                    />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupAddon align={"inline-end"}>
                        <Kbd>⌘</Kbd><Kbd>K</Kbd>
                    </InputGroupAddon>
                </InputGroup>
                <div className="flex items-center gap-3">
                    <CreateArenaDialog />
                    <JoinArenaDialog joinArena={joinArena} isJoining={isJoining} />
                </div>
            </div>
        </div>
    )
}
