import { User } from 'better-auth';
import { Socket } from 'socket.io-client';
import ProximityPanel from './overlay/ProximityPanel';

interface CanvasOverlayProps {
  adminUser: User;
  socket: Socket | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  handleCreateOffer: (answerUserId: string) => Promise<void>;
  handleResetCallSession: () => void;
  handleMediaToggle: (mediaType: "video" | "audio", enabled: boolean,participantId: string) => void;
}

export default function CanvasOverlay({
  adminUser,
  socket,
  localStream,
  remoteStream,
  handleCreateOffer,
  handleResetCallSession,
  handleMediaToggle,
}: CanvasOverlayProps) {
  return (
    <>
      <ProximityPanel
        adminUser={adminUser}
        socket={socket}
        localStream={localStream}
        remoteStream={remoteStream}
        handleCreateOffer={handleCreateOffer}
        handleResetCallSession={handleResetCallSession}
        handleMediaToggle={handleMediaToggle}
      />
    </>
  )
}
