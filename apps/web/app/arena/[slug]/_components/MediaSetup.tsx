'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IoCheckmarkCircleOutline, IoWarningOutline } from "react-icons/io5";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { toast } from "sonner";

interface MediaSetupProps {
    localStream: MediaStream | null;
    setLocalStream: Dispatch<SetStateAction<MediaStream | null>>;
    setIsUserMediaReady: Dispatch<SetStateAction<boolean>>;
}

export default function MediaSetup({ localStream, setLocalStream, setIsUserMediaReady }: MediaSetupProps) {

    const [cameraPermission, setCameraPermission] = useState<PermissionState | "unknown">("unknown");
    const [micPermission, setMicPermission] = useState<PermissionState | "unknown">("unknown");
    const [isMicOn, setIsMicOn] = useState<boolean>(true);
    const [isCameraOn, setIsCameraOn] = useState<boolean>(true);

    const micStatusRef = useRef<PermissionStatus | null>(null);
    const cameraStatusRef = useRef<PermissionStatus | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const hasPermissionsAPI = !!navigator.permissions?.query;

    useEffect(() => {
        if (localStream) return;
        const getUserStream = async () => {
            try {
                micStatusRef.current = await navigator.permissions.query({ name: "microphone" });
                cameraStatusRef.current = await navigator.permissions.query({ name: "camera" });

                setMicPermission(micStatusRef.current.state);
                setCameraPermission(cameraStatusRef.current.state);

                micStatusRef.current.onchange = () => {
                    setMicPermission(micStatusRef.current!.state);
                    if (micStatusRef.current!.state === "granted" && cameraStatusRef.current!.state === "granted" && !localStream) {
                        getUserStream();
                    }
                }
                cameraStatusRef.current.onchange = () => {
                    setCameraPermission(cameraStatusRef.current!.state);
                    if (micStatusRef.current!.state === "granted" && cameraStatusRef.current!.state === "granted" && !localStream) {
                        getUserStream();
                    }
                }

                if (micStatusRef.current.state !== "granted" || cameraStatusRef.current.state !== "granted") return;

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                stream.getTracks().forEach(track => {
                    if (track.kind === "audio") track.enabled = isMicOn;
                    else if (track.kind === "video") track.enabled = isCameraOn;
                })
                setLocalStream(stream);
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Media error occurred. Please try again.");
                setMicPermission("denied");
                setCameraPermission("denied");
            }
        }

        if (hasPermissionsAPI) {
            getUserStream();
        } else {
            // Safari fallback
            navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                .then(stream => {
                    setLocalStream(stream);
                    setMicPermission("granted");
                    setCameraPermission("granted");
                })
                .catch(() => {
                    setMicPermission("denied");
                    setCameraPermission("denied");
                });
        }

        return () => {
            if (micStatusRef.current) micStatusRef.current.onchange = null;
            if (cameraStatusRef.current) cameraStatusRef.current.onchange = null;
        }
    }, [localStream, hasPermissionsAPI, isMicOn, isCameraOn])

    useEffect(() => {
        if (!videoRef.current || !localStream) return;
        videoRef.current.srcObject = localStream;
    }, [localStream]);

    useEffect(() => {
        if (!localStream) return;
        localStream.getTracks().forEach(track => {
            if (track.kind === "audio") track.enabled = isMicOn;
            else if (track.kind === "video") track.enabled = isCameraOn;
        })
    }, [isMicOn, isCameraOn]);

    const isMicGranted = micPermission === "granted";
    const isCameraGranted = cameraPermission === "granted";

    let statusMessage = "";

    if (!isMicGranted && !isCameraGranted) statusMessage = "Camera and microphone are blocked. Allow access to continue.";
    else if (!isMicGranted) statusMessage = "Microphone is blocked. Allow access in browser settings.";
    else if (!isCameraGranted) statusMessage = "Camera is blocked. Enable camera access to continue.";
    else statusMessage = "Camera and microphone are enabled. You're good to go.";

    return (
        <div className="absolute inset-0 bg-background flex items-center justify-center gap-10 text-center">
            <div className="flex gap-16 w-full max-w-6xl">
                <div className="flex items-center justify-center w-[610px] h-[400px] bg-accent rounded-2xl relative overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted 
                        className={cn(
                            "size-full object-cover transition",
                            isCameraOn ? "opacity-100" : "opacity-0"
                        )}
                    />
                    {!isCameraOn &&
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h3 className="text-primary text-lg">Your camera is off</h3>
                        </div>
                    }

                    <div className="absolute bottom-5 flex gap-5">
                        <Button
                            variant={"default"}
                            size={"icon-lg"}
                            onClick={() => setIsMicOn(c => !c)}
                        >
                            {isMicOn ? <IoMdMic className="size-5" /> : <IoMdMicOff className="size-5 text-destructive" />}
                        </Button>
                        <Button
                            variant={"default"}
                            size={"icon-lg"}
                            onClick={() => setIsCameraOn(c => !c)}
                        >
                            {isCameraOn ? <BsCameraVideo className="size-5" /> : <BsCameraVideoOff className="size-5 text-destructive" />}
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-8 px-5">
                    <h2 className="max-w-sm text-left">
                        {statusMessage}
                    </h2>

                    <div className="space-y-5">
                        <div className="flex items-center justify-between p-3 rounded-lg shadow-sm border">
                            <span>Microphone</span>
                            {
                                isMicGranted ?
                                    <IoCheckmarkCircleOutline className="size-6 text-success" /> :
                                    <IoWarningOutline className="size-6 text-yellow-400" />
                            }
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg shadow-sm border">
                            <span>Camera</span>
                            {
                                isCameraGranted ?
                                    <IoCheckmarkCircleOutline className="size-6 text-success" /> :
                                    <IoWarningOutline className="size-6 text-yellow-400" />
                            }
                        </div>
                    </div>

                    <Button
                        size={"lg"}
                        variant={"3d"}
                        onClick={() => setIsUserMediaReady(true)}
                        disabled={!isMicGranted || !isCameraGranted}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
