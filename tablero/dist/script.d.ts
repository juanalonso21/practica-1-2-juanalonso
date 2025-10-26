interface IParticipant {
    id: string;
    name: string;
    email: string;
    phone?: string;
}
declare class Participant implements IParticipant {
    id: string;
    name: string;
    email: string;
    phone?: string;
    constructor(id: string, name: string, email: string, phone?: string);
    private isValidEmail;
    updateContactInfo(email: string, phone?: string): void;
    getParticipantInfo(): IParticipant;
}
type BoardNumber = {
    number: string;
    isOccupied: boolean;
    participantId: string | null;
};
declare class Board {
    private board;
    private participants;
    constructor();
    private initializeBoard;
    registerParticipant(participant: IParticipant): void;
    getParticipant(participantId: string): IParticipant | undefined;
    getAllParticipants(): IParticipant[];
    reserveNumber(participantId: string, boardNumber: string): void;
    freeNumber(boardNumber: string): void;
    getBoardStatus(): BoardNumber[];
    getOccupiedNumbersCount(): number;
    getFreeNumbersCount(): number;
    getParticipantNumbers(participantId: string): string[];
    getWinner(winningNumber: string): IParticipant | null;
}
declare const christmasRaffleBoard: Board;
declare let selectedNumberForModal: string | null;
declare const openRegisterParticipantModalBtn: HTMLButtonElement;
declare const participantsList: HTMLUListElement;
declare const boardGrid: HTMLDivElement;
declare const winningNumberInput: HTMLInputElement;
declare const drawWinnerBtn: HTMLButtonElement;
declare const winnerDisplay: HTMLDivElement;
declare const occupiedCountSpan: HTMLSpanElement;
declare const freeCountSpan: HTMLSpanElement;
declare const totalParticipantsSpan: HTMLSpanElement;
declare const registerParticipantModal: HTMLDialogElement;
declare const modalParticipantNameInput: HTMLInputElement;
declare const modalParticipantEmailInput: HTMLInputElement;
declare const modalParticipantPhoneInput: HTMLInputElement;
declare const modalRegisterParticipantBtn: HTMLButtonElement;
declare const modalParticipantMessage: HTMLDivElement;
declare const reserveNumberModal: HTMLDialogElement;
declare const modalNumberToReserveSpan: HTMLSpanElement;
declare const modalParticipantSelect: HTMLSelectElement;
declare const modalReserveExistingBtn: HTMLButtonElement;
declare const modalFreeNumberBtn: HTMLButtonElement;
declare const modalNewParticipantNameInput: HTMLInputElement;
declare const modalNewParticipantEmailInput: HTMLInputElement;
declare const modalNewParticipantPhoneInput: HTMLInputElement;
declare const modalReserveNewBtn: HTMLButtonElement;
declare const modalReserveMessage: HTMLDivElement;
declare function displayMessage(element: HTMLElement, message: string, isError?: boolean): void;
declare const LOCAL_STORAGE_KEY = "christmasRaffleBoardState";
declare function saveBoardState(): void;
declare function loadBoardState(): void;
declare function renderParticipants(): void;
declare function renderBoard(): void;
declare function updateStatistics(): void;
//# sourceMappingURL=script.d.ts.map