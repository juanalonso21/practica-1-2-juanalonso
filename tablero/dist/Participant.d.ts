export interface IParticipant {
    id: string;
    name: string;
    email: string;
    phone?: string;
}
export declare class Participant implements IParticipant {
    id: string;
    name: string;
    email: string;
    phone?: string;
    constructor(id: string, name: string, email: string, phone?: string);
    private isValidEmail;
    updateContactInfo(email: string, phone?: string): void;
    getParticipantInfo(): IParticipant;
}
//# sourceMappingURL=Participant.d.ts.map