import UserMenu from './UserMenu'
import { ModeToggle } from '@/components/mode-toggle';

export default function Navbar() {
  return (
    <nav className='fixed top-5 inset-x-0 w-full max-w-7xl mx-auto px-5 bg-sidebar/80 backdrop-blur-md border rounded-lg z-50'>
      <div className='flex justify-between items-center h-16 w-full mx-auto'>
        <div className='flex items-center gap-5'>
          <div className='flex items-center justify-center bg-muted border rounded-lg size-10' />
          <h3>CoSpace</h3>
        </div>
        <div className='flex items-center gap-2 h-full'>
          <div className='flex items-center gap-3'>
            <ModeToggle />
          </div>
          <div className='h-[50%] w-[1px] rounded-full bg-muted' />
          <UserMenu  />
        </div>
      </div>
    </nav>
  )
}
