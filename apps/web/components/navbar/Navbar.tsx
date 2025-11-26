import { ModeToggle } from '@/components/mode-toggle';
import UserMenu from './UserMenu'
import Logo from '../Logo';

export default function Navbar() {
  return (
    <nav className='fixed top-5 inset-x-0 w-full max-w-7xl mx-auto px-5 bg-sidebar/80 backdrop-blur-md border rounded-lg z-50'>
      <div className='flex justify-between items-center h-16 w-full mx-auto'>
        <div className='flex items-center gap-5'>
          <Logo />
          <h3>CoSpace</h3>
        </div>
        <div className='flex items-center gap-2 h-full'>
          <div className='flex items-center gap-3'>
            <ModeToggle />
          </div>
          <div className='h-[50%] w-[1px] rounded-full bg-muted' />
          <UserMenu />
        </div>
      </div>
    </nav>
  )
}
