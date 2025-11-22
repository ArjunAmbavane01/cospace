export type TypeOfCall = "offer" | "answer" | undefined;

export interface CallSession {
    offererUserId: string;
    answererUserId: string;
    arenaSlug: string;
    offer: RTCSessionDescriptionInit | null;
    offererIceCandidates: RTCIceCandidateInit[];
    answer: RTCSessionDescriptionInit | null;
    answererIceCandidates: RTCIceCandidateInit[];
} 