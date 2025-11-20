export type TypeOfCall = "offer" | "answer";

export interface CallStatus {
    haveMedia: boolean,
    videoEnabled: boolean,
    audioEnabled: boolean,
    answer: RTCSessionDescriptionInit | null,
    myRole: TypeOfCall
}

export interface OfferData {
    offerUserId: string;
    answerUserId: string;
    arenaSlug: string;
    offer: RTCSessionDescriptionInit | null;
    offerIceCandidates: RTCIceCandidateInit[];
    answer: RTCSessionDescriptionInit | null;
    answerIceCandidates: RTCIceCandidateInit[];
} 