import { useEffect, useRef, useState } from 'react';
import Image from 'next/image'
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BsCameraVideo, BsCameraVideoOff } from 'react-icons/bs';
import { IoMdMic, IoMdMicOff } from "react-icons/io";

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
    const [participantMicOn, setParticipantMicOn] = useState<boolean>(false);
    const [participantCameraOn, setParticipantCameraOn] = useState<boolean>(false);

    const localVidRef = useRef<HTMLVideoElement | null>(null);
    const remoteVidRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (!localStream) return;

        const audioTrack = localStream.getTracks().find(track => track.kind === "audio");
        const videoTrack = localStream.getTracks().find(track => track.kind === "video");

        if (audioTrack) setIsMicOn(audioTrack.enabled);
        if (videoTrack) setIsCameraOn(videoTrack.enabled);
    }, [localStream]);

    useEffect(() => {
        if (!localStream) return;
        localStream.getTracks().forEach(track => {
            if (track.kind === "audio") track.enabled = isMicOn;
            else if (track.kind === "video") track.enabled = isCameraOn;
        })
    }, [isMicOn, isCameraOn, localStream]);

    useEffect(() => {
        if (localVidRef.current && localStream) {
            localVidRef.current.srcObject = localStream;
            // localVidRef.current.play().catch(err => {
                // console.log('error autoplaying local video :', err);
            // });
        }
        if (remoteVidRef.current && remoteStream) {
            remoteVidRef.current.srcObject = remoteStream;
            // remoteVidRef.current.play().catch(err => {
                // console.log('Remote video autoplay prevented:', err);
            // });

            const audioTrack = remoteStream.getAudioTracks()[0];
            const videoTrack = remoteStream.getVideoTracks()[0];

            if (audioTrack) setParticipantMicOn(audioTrack.enabled);
            if (videoTrack) setParticipantCameraOn(videoTrack.enabled);
        }
    }, [localStream, remoteStream])

    useEffect(() => {
        if (!remoteStream) return;

        const updateRemoteTrackStatus = () => {
            const audioTrack = remoteStream.getAudioTracks()[0];
            const videoTrack = remoteStream.getVideoTracks()[0];

            if (audioTrack) setParticipantMicOn(audioTrack.enabled);
            if (videoTrack) setParticipantCameraOn(videoTrack.enabled);
        }

        updateRemoteTrackStatus();

        remoteStream.getTracks().forEach(track => {
            track.addEventListener("mute", updateRemoteTrackStatus);
            track.addEventListener("unmute", updateRemoteTrackStatus);
            track.addEventListener("ended", updateRemoteTrackStatus);
        })

        return () => {
            remoteStream.getTracks().forEach(track => {
                track.removeEventListener("mute", updateRemoteTrackStatus);
                track.removeEventListener("unmute", updateRemoteTrackStatus);
                track.removeEventListener("ended", updateRemoteTrackStatus);
            })
        }
    }, [remoteStream])


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
                        isCameraOn ? "opacity-100 visible" : "opacity-0 invisible"
                    )}
                />

                {!isCameraOn && adminImage && (
                    <div className="flex items-center justify-center size-full">
                        <Image
                            src={adminImage}
                            alt='user avatar'
                            width={40}
                            height={40}
                            className='size-10 border-2 border-muted-foreground rounded-full'
                        />
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
                        onClick={() => {
                            setIsMicOn(c => !c);
                        }}
                    >
                        {isMicOn ? <IoMdMic className="size-5" /> : <IoMdMicOff className="size-5 text-destructive" />}
                    </Button>
                    <Button
                        variant={"default"}
                        size={"icon"}
                        onClick={() => {
                            setIsCameraOn(v => !v);
                        }}
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
                        participantCameraOn ? "opacity-100 visible" : "opacity-0 invisible"
                    )}
                />
                {!participantCameraOn && participantImage && (
                    <div className="flex items-center justify-center size-full">
                        <Image
                            src={participantImage}
                            alt='user avatar'
                            width={40}
                            height={40}
                            className='size-10 border-2 border-muted-foreground rounded-full'
                        />
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
