import { Dispatch, SetStateAction } from 'react';
import { User } from 'better-auth';
import { Socket } from 'socket.io-client';
import { OfferData, TypeOfCall } from '@/lib/validators/rtc';
import ProximityPanel from './overlay/ProximityPanel';

interface CanvasOverlayProps {
  adminUser: User;
  webrtcSocket: Socket | null;
  localStream: MediaStream | null;
  setLocalStream: Dispatch<SetStateAction<MediaStream | null>>;
  remoteStream: MediaStream | null;
  setRemoteStream: Dispatch<SetStateAction<MediaStream | null>>;
  peerConnection: RTCPeerConnection | null;
  setPeerConnection: Dispatch<SetStateAction<RTCPeerConnection | null>>;
  offerData: OfferData | null;
  setOfferData: Dispatch<SetStateAction<OfferData | null>>;
  setTypeOfCall: Dispatch<SetStateAction<TypeOfCall>>;
  handleCreatePeerConnection: () => Promise<RTCPeerConnection | undefined>;
  handleCreateOffer: (peerConnection: RTCPeerConnection, answerUserId: string) => Promise<void>;
}

export default function CanvasOverlay({
  adminUser,
  webrtcSocket,
  localStream,
  setLocalStream,
  remoteStream,
  setRemoteStream,
  peerConnection,
  setPeerConnection,
  offerData,
  setOfferData,
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
        setLocalStream={setLocalStream}
        remoteStream={remoteStream}
        setRemoteStream={setRemoteStream}
        peerConnection={peerConnection}
        setPeerConnection={setPeerConnection}
        offerData={offerData}
        setOfferData={setOfferData}
        handleCreatePeerConnection={handleCreatePeerConnection}
        handleCreateOffer={handleCreateOffer}
        setTypeOfCall={setTypeOfCall}
      />
    </>
  )
}
