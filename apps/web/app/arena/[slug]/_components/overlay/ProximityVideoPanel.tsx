import { useEffect, useRef, useState } from 'react';
import Image from 'next/image'
import { User } from 'better-auth';
import { Socket } from 'socket.io-client';
import { ServerToClientEvents } from '@repo/schemas/ws-arena-events';
import { ClientToServerEvents } from '@repo/schemas/arena-ws-events';
import { ArenaUser } from '@/lib/validators/arena';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { BsCameraVideo, BsCameraVideoOff } from 'react-icons/bs';

interface ProximityVideoPanel {
    admin: User;
    participant: ArenaUser;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
    handleMediaToggle: (mediaType: "video" | "audio", enabled: boolean, participantId: string) => void;
}

export default function ProximityVideoPanel({
    admin,
    participant,
    localStream,
    remoteStream,
    socket,
    handleMediaToggle,
}: ProximityVideoPanel) {

    const [isMicOn, setIsMicOn] = useState<boolean>(true);
    const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
    const [participantMicOn, setParticipantMicOn] = useState<boolean>(true);
    const [participantCameraOn, setParticipantCameraOn] = useState<boolean>(true);

    const localVidRef = useRef<HTMLVideoElement | null>(null);
    const remoteVidRef = useRef<HTMLVideoElement | null>(null);
    const isInitializedRef = useRef<boolean>(false);

    useEffect(() => {
        if (!localStream || isInitializedRef.current) return;
        setIsMicOn(localStream.getAudioTracks()[0]?.enabled ?? false);
        setIsCameraOn(localStream.getVideoTracks()[0]?.enabled ?? false);
        isInitializedRef.current = true;
    }, [localStream]);

    useEffect(() => {
        if (!localStream) return;
        localStream.getAudioTracks().forEach(t => (t.enabled = isMicOn));
        handleMediaToggle("audio", isMicOn, participant.id);
    }, [isMicOn, localStream, handleMediaToggle, participant.id]);

    useEffect(() => {
        if (!localStream) return;
        localStream.getVideoTracks().forEach(t => (t.enabled = isCameraOn));
        handleMediaToggle("video", isCameraOn, participant.id);
    }, [isCameraOn, localStream, handleMediaToggle, participant.id]);

    useEffect(() => {
        if (localVidRef.current && localStream) localVidRef.current.srcObject = localStream;
    }, [localStream]);

    useEffect(() => {
        if (!remoteVidRef.current || !remoteStream) return;

        if (remoteVidRef.current.srcObject !== remoteStream) {
            remoteVidRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    useEffect(() => {
        if (!socket) return;
        const handleRemoteMediaToggle = (data: {
            userId: string;
            participantId: string;
            mediaType: "audio" | "video";
            enabled: boolean
        }) => {
            if (data.userId !== participant.id || data.participantId !== admin.id) return;
            if (data.mediaType === "audio") setParticipantMicOn(data.enabled);
            else if (data.mediaType === "video") setParticipantCameraOn(data.enabled);
        };

        socket.on("media-toggle", handleRemoteMediaToggle);

        return () => {
            socket.off("media-toggle", handleRemoteMediaToggle);
        };
    }, [socket, participant.id, admin.id]);


    const { name: participantName, image: participantImage } = participant;
    const { name: adminName, image: adminImage } = admin;

    return (

        <div className='flex gap-2 w-fit p-1 pb-5 rounded-xl bg-[#3f323e] border border-muted group'>
            {/* admin video tile */}
            <div className='flex flex-col justify-center items-center gap-2 h-32 w-56 bg-card border border-muted-foreground rounded-lg relative overflow-hidden'>
                <video
                    ref={localVidRef}
                    autoPlay
                    playsInline
                    muted
                    className={cn(
                        "absolute inset-0 size-full object-cover",
                        isCameraOn ? "block" : "hidden"
                    )}
                />

                {!isCameraOn && (
                    <div className="flex items-center justify-center size-full">
                        {adminImage ? (
                            <Image
                                src={adminImage}
                                alt='user avatar'
                                width={40}
                                height={40}
                                className='size-10 border-2 border-muted-foreground rounded-full'
                            />
                        ) : (
                            <div className='flex items-center justify-center size-10 border-2 border-muted-foreground rounded-full bg-muted'>
                                <h4>
                                    {adminName.charAt(0).toUpperCase()}
                                </h4>
                            </div>
                        )}
                    </div>
                )}

                <h6 className='flex items-center gap-1 absolute bottom-1.5 left-1.5 bg-muted rounded-lg p-1 px-2'>
                    {!isMicOn && <IoMdMicOff size={14} className='text-destructive' />}
                    {adminName}
                </h6>

                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition ">
                    <Button
                        variant={"default"}
                        size={"icon"}
                        onClick={() => setIsMicOn(c => !c)}
                    >
                        {isMicOn ? <IoMdMic className="size-5" /> : <IoMdMicOff className="size-5 text-destructive" />}
                    </Button>
                    <Button
                        variant={"default"}
                        size={"icon"}
                        onClick={() => setIsCameraOn(v => !v)}
                    >
                        {isCameraOn ? <BsCameraVideo className="size-5" /> : <BsCameraVideoOff className="size-5 text-destructive" />}
                    </Button>
                </div>
            </div>


            {/* participant video tile */}
            <div className='flex flex-col justify-center items-center gap-2 h-32 w-56 bg-card border border-muted-foreground rounded-lg relative overflow-hidden'>

                <video
                    ref={remoteVidRef}
                    autoPlay
                    playsInline
                    className={cn(
                        "absolute inset-0 size-full object-cover",
                        participantCameraOn ? "block" : "hidden"
                    )}
                />

                {!participantCameraOn && (
                    <div className="flex items-center justify-center size-full">
                        {participantImage ? (
                            <Image
                                src={participantImage}
                                alt='user avatar'
                                width={40}
                                height={40}
                                className='size-10 border-2 border-muted-foreground rounded-full'
                            />
                        ) : (
                            <div className='size-10 border-2 border-muted-foreground rounded-full bg-muted flex items-center justify-center'>
                                <h4>
                                    {participantName.charAt(0).toUpperCase()}
                                </h4>
                            </div>
                        )}
                    </div>
                )}

                <h6 className='flex items-center gap-1 absolute bottom-1.5 left-1.5 bg-muted rounded-lg p-1 px-2'>
                    {!participantMicOn && <IoMdMicOff size={14} className='text-destructive' />}
                    {participantName}
                </h6>
            </div>
        </div>

    )
}
