import Image from 'next/image'
import { IoMdMicOff } from "react-icons/io";

interface ProximityCardProps {
    name: string;
    image: string | null | undefined;
}

export default function ProximityCard({ name, image }: ProximityCardProps) {
    return (
        <div className='flex flex-col justify-center items-center gap-2 h-32 w-56 bg-card border border-muted-foreground rounded-lg relative'>
            {
                image &&
                <Image src={image} alt='user avatar' width={32} height={32} className='size-10 border-2 border-muted-foreground rounded-full' />
            }
            <h6 className='flex items-center gap-1 absolute bottom-1.5 left-1.5 bg-muted rounded-lg p-1 px-2'>
                <IoMdMicOff size={14} className='text-destructive'/>{name}
            </h6>
        </div>
    )
}
