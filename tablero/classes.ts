export interface IParticipant {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export class Participant implements IParticipant {
  id: string;
  name: string;
  email: string;
  phone?: string;

  constructor(id: string, name: string, email: string, phone?: string) {
    if (!id || !name) {
      throw new Error("El participante debe tener un id y un nombre.");
    }
    if (!email) {
      throw new Error("El participante debe tener un correo electrónico.");
    }
    if (!this.isValidEmail(email)) {
      throw new Error("Formato de correo electrónico inválido.");
    }

    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^@ ]+@[^@ ]+\.[^@ ]+$/;
    return emailRegex.test(email);
  }

  updateContactInfo(email: string, phone?: string): void {
    if (!this.isValidEmail(email)) {
      throw new Error("Formato de correo electrónico inválido.");
    }
    this.email = email;
    this.phone = phone;
  }

  getParticipantInfo(): IParticipant {
    return { id: this.id, name: this.name, email: this.email, phone: this.phone };
  }
}

export type BoardNumber = {
  number: string;
  isOccupied: boolean;
  participantId: string | null;
};

export class Board {
  private board: BoardNumber[] = [];
  private participants: Map<string, IParticipant> = new Map();

  constructor() {
    this.initializeBoard();
  }

  private initializeBoard(): void {
    for (let i = 0; i < 100; i++) {
      const number = i.toString().padStart(2, '0');
      this.board.push({
        number,
        isOccupied: false,
        participantId: null,
      });
    }
  }

  registerParticipant(participant: IParticipant): void {
    if (this.participants.has(participant.id)) {
      throw new Error('Participante con este ID ya registrado.');
    }
    this.participants.set(participant.id, participant);
  }

  getParticipant(participantId: string): IParticipant | undefined {
    return this.participants.get(participantId);
  }

  getAllParticipants(): IParticipant[] {
    return Array.from(this.participants.values());
  }

  reserveNumber(participantId: string, boardNumber: string): void {
    const participant = this.participants.get(participantId);
    if (!participant) {
      throw new Error('Participante no encontrado.');
    }

    const numberIndex = this.board.findIndex(n => n.number === boardNumber);
    if (numberIndex === -1) {
      throw new Error('Número de tablero inválido.');
    }

    if (this.board[numberIndex].isOccupied) {
      throw new Error(`El número ${boardNumber} ya está ocupado.`);
    }

    this.board[numberIndex].isOccupied = true;
    this.board[numberIndex].participantId = participantId;
  }

  freeNumber(boardNumber: string): void {
    const numberIndex = this.board.findIndex(n => n.number === boardNumber);
    if (numberIndex === -1) {
      throw new Error('Número de tablero inválido.');
    }

    if (!this.board[numberIndex].isOccupied) {
      throw new Error(`El número ${boardNumber} no está ocupado.`);
    }

    this.board[numberIndex].isOccupied = false;
    this.board[numberIndex].participantId = null;
  }

  getBoardStatus(): BoardNumber[] {
    return [...this.board];
  }

  getOccupiedNumbersCount(): number {
    return this.board.filter(n => n.isOccupied).length;
  }

  getFreeNumbersCount(): number {
    return this.board.filter(n => !n.isOccupied).length;
  }

  getParticipantNumbers(participantId: string): string[] {
    return this.board
      .filter(n => n.participantId === participantId)
      .map(n => n.number);
  }

  getWinner(winningNumber: string): IParticipant | null {
    const numberIndex = this.board.findIndex(n => n.number === winningNumber);
    if (numberIndex === -1) {
      throw new Error('Número de tablero ganador inválido.');
    }

    const winningBoardNumber = this.board[numberIndex];
    if (winningBoardNumber.isOccupied && winningBoardNumber.participantId) {
      return this.participants.get(winningBoardNumber.participantId) || null;
    }
    return null;
  }
}
