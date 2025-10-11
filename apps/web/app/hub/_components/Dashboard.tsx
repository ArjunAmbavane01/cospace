"use client"
import { Button } from "@/components/ui/button";
import useAuth from "hooks/useAuth";


export default function Dashboard() {
    const { logout } = useAuth();

    return (
        <div className='p-3 bg-red-400'>
            Dashboard
            <Button onClick={logout}>Log out</Button>
        </div>
    )
}
