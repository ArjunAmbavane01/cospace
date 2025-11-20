import { Dispatch, SetStateAction } from 'react';
import { User } from 'better-auth';
import { Socket } from 'socket.io-client';
import { CallStatus, OfferData, TypeOfCall } from '@/lib/validators/rtc';
import ProximityPanel from './overlay/ProximityPanel';

interface CanvasOverlayProps {
  adminUser: User;
  webrtcSocket: Socket | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  offerData: OfferData | null;
  setOfferData: Dispatch<SetStateAction<OfferData | null>>;
  setCallStatus: Dispatch<SetStateAction<CallStatus>>;
  setTypeOfCall: Dispatch<SetStateAction<TypeOfCall>>;
  handleCreatePeerConnection: () => Promise<RTCPeerConnection | undefined>;
  handleCreateOffer: (peerConnection: RTCPeerConnection, answerUserId: string) => Promise<void>;
}

export default function CanvasOverlay({
  adminUser,
  webrtcSocket,
  localStream,
  remoteStream,
  peerConnection,
  offerData,
  setOfferData,
  setCallStatus,
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
        peerConnection={peerConnection}
        offerData={offerData}
        setOfferData={setOfferData}
        setCallStatus={setCallStatus}
        handleCreatePeerConnection={handleCreatePeerConnection}
        handleCreateOffer={handleCreateOffer}
        setTypeOfCall={setTypeOfCall}
      />
    </>
  )
}
