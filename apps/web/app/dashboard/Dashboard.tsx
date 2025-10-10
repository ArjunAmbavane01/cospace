"use client"
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/index";


export default function Dashboard() {
    const { loading, logout } = useAuth();

    return (
        <div className='p-3 bg-red-400'>
            Dashboard
            <Button onClick={logout}>Log out</Button>
        </div>
    )
}
