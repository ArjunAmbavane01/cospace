import { TbTopologyStar3 } from 'react-icons/tb';

function Logo() {
  return (
    <div className="flex items-center justify-center rounded-lg size-10 relative bg-gradient-to-b from-blue-500 to-blue-700 !text-white font-medium shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_1px_1px_0_rgba(0,0,0,0.1)] before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-b before:from-white/20 before:to-transparent before:opacity-100 active:shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_1px_1px_0_rgba(0,0,0,0.2)_inset] active:translate-y-[1px] transition-all duration-150 border border-blue-600">
      <TbTopologyStar3 className='size-5 text-white' />
    </div>
  )
}

export default Logo;
