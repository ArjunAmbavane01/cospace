export type TypeOfCall = "offer" | "answer";

export interface OfferData {
    offerUserId: string;
    answerUserId: string;
    arenaSlug: string;
    offer: RTCSessionDescriptionInit | null;
    offerIceCandidates: RTCIceCandidateInit[];
    answer: RTCSessionDescriptionInit | null;
    answerIceCandidates: RTCIceCandidateInit[];
} 