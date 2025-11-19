export interface Offer {
    offerUserId:string;
    answerUserId:string;
    arenaSlug:string;
    offer:any;
    offerIceCandidates:any[];
    answer:any|null;
    answerIceCandidates:any[];
} 