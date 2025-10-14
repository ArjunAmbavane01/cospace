import { User } from 'better-auth';
import UserMenu from './UserMenu'
import { ModeToggle } from '@/components/mode-toggle';
import { InputGroup, InputGroupAddon, InputGroupInput, } from "@/components/ui/input-group"
import { Kbd } from '@/components/ui/kbd';
import { SearchIcon } from 'lucide-react';

interface NavbarProps {
  user: User
}

export default async function Navbar({ user }: NavbarProps) {
  return (
    <nav className='absolute top-0 inset-x-0 w-full bg-sidebar backdrop-blur-sm border-b'>
      <div className='flex justify-between items-center h-16 w-full max-w-7xl mx-auto'>
        <div className='flex items-center gap-16'>
          <h3>CoSpace</h3>
          <InputGroup className="w-sm">
            <InputGroupInput placeholder="Search arenas" />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align={"inline-end"}>
              <Kbd>⌘</Kbd><Kbd>K</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className='flex items-center gap-3 h-full'>
          <div className='flex items-center gap-3'>
            <ModeToggle />
          </div>
          <div className='h-[50%] w-0.5 rounded-full bg-muted' />
          <UserMenu user={user} />
        </div>
      </div>
    </nav>
  )
}
