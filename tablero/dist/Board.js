"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Board {
    constructor() {
        this.board = [];
        this.participants = new Map();
        this.initializeBoard();
    }
    initializeBoard() {
        for (let i = 0; i < 100; i++) {
            const number = i.toString().padStart(2, '0');
            this.board.push({
                number,
                isOccupied: false,
                participantId: null,
            });
        }
    }
    registerParticipant(participant) {
        if (this.participants.has(participant.id)) {
            throw new Error('Participant with this ID already registered.');
        }
        this.participants.set(participant.id, participant);
    }
    getParticipant(participantId) {
        return this.participants.get(participantId);
    }
    getAllParticipants() {
        return Array.from(this.participants.values());
    }
    reserveNumber(participantId, boardNumber) {
        const participant = this.participants.get(participantId);
        if (!participant) {
            throw new Error('Participant not found.');
        }
        const numberIndex = this.board.findIndex(n => n.number === boardNumber);
        if (numberIndex === -1) {
            throw new Error('Invalid board number.');
        }
        if (this.board[numberIndex].isOccupied) {
            throw new Error(`Number ${boardNumber} is already occupied.`);
        }
        this.board[numberIndex].isOccupied = true;
        this.board[numberIndex].participantId = participantId;
    }
    freeNumber(boardNumber) {
        const numberIndex = this.board.findIndex(n => n.number === boardNumber);
        if (numberIndex === -1) {
            throw new Error('Invalid board number.');
        }
        if (!this.board[numberIndex].isOccupied) {
            throw new Error(`Number ${boardNumber} is not occupied.`);
        }
        this.board[numberIndex].isOccupied = false;
        this.board[numberIndex].participantId = null;
    }
    getBoardStatus() {
        return [...this.board];
    }
    getOccupiedNumbersCount() {
        return this.board.filter(n => n.isOccupied).length;
    }
    getFreeNumbersCount() {
        return this.board.filter(n => !n.isOccupied).length;
    }
    getParticipantNumbers(participantId) {
        return this.board
            .filter(n => n.participantId === participantId)
            .map(n => n.number);
    }
    getWinner(winningNumber) {
        const numberIndex = this.board.findIndex(n => n.number === winningNumber);
        if (numberIndex === -1) {
            throw new Error('Invalid winning number.');
        }
        const winningBoardNumber = this.board[numberIndex];
        if (winningBoardNumber.isOccupied && winningBoardNumber.participantId) {
            return this.participants.get(winningBoardNumber.participantId) || null;
        }
        return null;
    }
}
//# sourceMappingURL=Board.js.map