import { Dispatch, SetStateAction } from 'react';
import { User } from 'better-auth';
import { Socket } from 'socket.io-client';
import { TypeOfCall } from '@/lib/validators/rtc';
import ProximityPanel from './overlay/ProximityPanel';

interface CanvasOverlayProps {
  adminUser: User;
  webrtcSocket: Socket | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  handleCreatePeerConnection: () => Promise<RTCPeerConnection | undefined>;
  handleCreateOffer: (peerConnection: RTCPeerConnection, answerUserId: string) => Promise<void>;
  setTypeOfCall: Dispatch<SetStateAction<TypeOfCall>>;
}

export default function CanvasOverlay({
  adminUser,
  webrtcSocket,
  localStream,
  remoteStream,
  handleCreatePeerConnection,
  handleCreateOffer,
  setTypeOfCall
}: CanvasOverlayProps) {
  return (
    <>
      <ProximityPanel
        adminUser={adminUser}
        webrtcSocket={webrtcSocket}
        localStream={localStream}
        remoteStream={remoteStream}
        handleCreatePeerConnection={handleCreatePeerConnection}
        handleCreateOffer={handleCreateOffer}
        setTypeOfCall={setTypeOfCall}
      />
    </>
  )
}
