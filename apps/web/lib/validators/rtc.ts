export type TypeOfCall = "offer" | "answer";

export interface CallStatus {
    haveMedia: boolean,
    videoEnabled: boolean,
    audioEnabled: boolean,
    answer:null,
    myRole:TypeOfCall
}