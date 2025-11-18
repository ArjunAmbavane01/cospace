'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { CallStatus } from "@/lib/validators/rtc";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IoCheckmarkCircleOutline, IoWarningOutline } from "react-icons/io5";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { toast } from "sonner";

interface MediaSetupProps {
    localStream: MediaStream | null;
    setCallStatus: Dispatch<SetStateAction<CallStatus>>;
    setLocalStream: Dispatch<SetStateAction<MediaStream | null>>;
    setIsUserMediaReady: Dispatch<SetStateAction<boolean>>;
}

export default function MediaSetup({ localStream, setCallStatus, setLocalStream, setIsUserMediaReady }: MediaSetupProps) {

    const [cameraPermission, setCameraPermission] = useState<PermissionState | "unknown">("unknown");
    const [micPermission, setMicPermission] = useState<PermissionState | "unknown">("unknown");
    const [isMicOn, setIsMicOn] = useState<boolean>(true);
    const [isCameraOn, setIsCameraOn] = useState<boolean>(true);

    const videoRef = useRef<HTMLVideoElement | null>(null);

    const hasPermissionsAPI = !!navigator.permissions?.query;

    useEffect(() => {
        if (!hasPermissionsAPI) return;
        const getUserStream = async () => {
            const micStatus = await navigator.permissions.query({ name: "microphone" });
            const cameraStatus = await navigator.permissions.query({ name: "camera" });

            setMicPermission(micStatus.state);
            setCameraPermission(cameraStatus.state);
            micStatus.onchange = () => setMicPermission(micStatus.state);
            cameraStatus.onchange = () => setCameraPermission(cameraStatus.state);

            if (micStatus.state !== "granted" || cameraStatus.state !== "granted") return;

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                stream.getTracks().forEach(track => {
                    if (track.kind === "audio") track.enabled = isMicOn;
                    else if (track.kind === "video") track.enabled = isCameraOn;
                })
                setCallStatus(c => ({ ...c, haveMedia: true }));
                setLocalStream(stream);
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Some error occurred. Please try again.");
            }
        }
        getUserStream();
    }, [micPermission, cameraPermission])

    // Safari fallback
    useEffect(() => {
        if (!hasPermissionsAPI) {
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
    }, []);

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
                        className={cn(
                            "size-full object-cover transition",
                            isCameraOn ? "opacity-100" : "opacity-0"
                        )}
                    />
                    {!isCameraOn &&
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h3 className="text-white text-lg">Your camera is off</h3>
                        </div>
                    }

                    <div className="absolute bottom-5 flex gap-5">
                        <Button
                            variant={"secondary"}
                            size={"icon-lg"}
                            onClick={() => setIsMicOn(c => !c)}
                        >
                            {isMicOn ? <IoMdMic /> : <IoMdMicOff className="size-5 text-destructive" />}
                        </Button>
                        <Button
                            variant={"secondary"}
                            size={"icon-lg"}
                            onClick={() => setIsCameraOn(c => !c)}
                        >
                            {isCameraOn ? <BsCameraVideo /> : <BsCameraVideoOff className="size-5 text-destructive" />}
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
