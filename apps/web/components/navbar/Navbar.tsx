import { User } from 'better-auth';
import UserMenu from './UserMenu'
import { ModeToggle } from '@/components/mode-toggle';

interface NavbarProps {
  user: User
}

export default async function Navbar({ user }: NavbarProps) {
  return (
    <nav className='absolute top-5 inset-x-0 w-full max-w-7xl mx-auto px-5 bg-sidebar backdrop-blur-sm border rounded-lg'>
      <div className='flex justify-between items-center h-16 w-full max-w-7xl mx-auto'>
        <div className='flex items-center gap-5'>
          <div className='flex items-center justify-center bg-muted border rounded-lg size-10'></div>
          <h3>CoSpace</h3>
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
