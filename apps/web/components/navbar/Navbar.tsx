import { Plus, PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import UserMenu from './UserMenu'
import type { User } from "better-auth";

interface NavbarProps {
  user: User;
}

export default async function Navbar({ user }: NavbarProps) {
  return (
    <nav className='absolute top-0 inset-x-0 w-full bg-sidebar backdrop-blur-sm border-b'>
      <div className='flex justify-between items-center h-16 w-full max-w-7xl mx-auto'>
        <h3>CoSpace</h3>
        <div className='flex items-center gap-5'>
          <UserMenu user={user} />
        </div>
      </div>
    </nav>
  )
}
