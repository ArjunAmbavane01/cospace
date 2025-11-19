import { useEffect, useRef, useState } from 'react';
import Image from 'next/image'
import { cn } from '@/lib/utils';
import { IoMdMicOff } from "react-icons/io";

interface ProximityVideoPanel {
    adminName: string;
    adminImage: string | null | undefined;
    participantName: string;
    participantImage: string | null | undefined;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
}

export default function ProximityVideoPanel({ adminName, adminImage, participantName, participantImage, localStream, remoteStream }: ProximityVideoPanel) {

    const [isMicOn, setIsMicOn] = useState<boolean>(true);
    const [isCameraOn, setIsCameraOn] = useState<boolean>(true);

    const localVidRef = useRef<HTMLVideoElement | null>(null);
    const remoteVidRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (!localStream) return;
        localStream.getTracks().forEach(track => {
            if (track.kind === "audio") track.enabled = isMicOn;
            else if (track.kind === "video") track.enabled = isCameraOn;
        })
    }, [isMicOn, isCameraOn]);

    useEffect(() => {
        if (!localVidRef.current || !remoteVidRef.current) return;
        localVidRef.current.srcObject = localStream;
        remoteVidRef.current.srcObject = remoteStream;
    }, [])


    return (

        <div className='flex gap-2 w-fit p-1 pb-5 rounded-xl bg-[#3f323e] border border-muted'>
            {/* admin video tile */}
            <div className='flex flex-col justify-center items-center gap-2 h-32 w-56 bg-card border border-muted-foreground rounded-lg relative overflow-hidden'>
                {isCameraOn ?
                    (
                        <video
                            ref={localVidRef}
                            autoPlay
                            playsInline
                            className={cn(
                                "size-full object-cover transition",
                                isCameraOn ? "opacity-100" : "opacity-0"
                            )}
                        />
                    ) :
                    (
                        adminImage &&
                        <Image src={adminImage} alt='user avatar' width={32} height={32} className='size-10 border-2 border-muted-foreground rounded-full opacity-95' />
                    )
                }

                <h6 className='flex items-center gap-1 absolute bottom-1.5 left-1.5 bg-muted rounded-lg p-1 px-2'>
                    <IoMdMicOff size={14} className='text-destructive' />{adminName}
                </h6>
            </div>


            {/* participant video tile */}
            <div className='flex flex-col justify-center items-center gap-2 h-32 w-56 bg-card border border-muted-foreground rounded-lg relative'>
                {isCameraOn ?
                    (
                        <video
                            ref={remoteVidRef}
                            autoPlay
                            playsInline
                            className={cn(
                                "size-full object-cover transition",
                                isCameraOn ? "opacity-100" : "opacity-0"
                            )}
                        />
                    ) :
                    (
                        participantImage &&
                        <Image src={participantImage} alt='user avatar' width={32} height={32} className='size-10 border-2 border-muted-foreground rounded-full' />
                    )
                }

                <h6 className='flex items-center gap-1 absolute bottom-1.5 left-1.5 bg-muted rounded-lg p-1 px-2'>
                    <IoMdMicOff size={14} className='text-destructive' />{participantName}
                </h6>
            </div>
        </div>

    )
}
