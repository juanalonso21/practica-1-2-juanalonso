import { Board, Participant } from './classes';

describe('Tablero', () => {
  let tablero: Board;
  let participante: Participant;

  beforeEach(() => {
    tablero = new Board();
    participante = new Participant('1', 'Jane Doe', 'jane.doe@example.com');
    tablero.registerParticipant(participante);
  });

  it('debe inicializar un tablero con 100 números', () => {
    expect(tablero.getBoardStatus().length).toBe(100);
    expect(tablero.getFreeNumbersCount()).toBe(100);
    expect(tablero.getOccupiedNumbersCount()).toBe(0);
  });

  it('debe registrar un participante', () => {
    const nuevoParticipante = new Participant('2', 'John Smith', 'john.smith@example.com');
    tablero.registerParticipant(nuevoParticipante);
    expect(tablero.getParticipant('2')).toEqual(nuevoParticipante);
  });

  it('debe lanzar un error si el participante ya está registrado', () => {
    expect(() => tablero.registerParticipant(participante)).toThrow('Participante con este ID ya registrado.');
  });

  it('debe reservar un número para un participante', () => {
    tablero.reserveNumber('1', '05');
    expect(tablero.getOccupiedNumbersCount()).toBe(1);
    expect(tablero.getFreeNumbersCount()).toBe(99);
    expect(tablero.getParticipantNumbers('1')).toEqual(['05']);
  });

  it('debe lanzar un error al reservar un número ocupado', () => {
    tablero.reserveNumber('1', '05');
    const otroParticipante = new Participant('2', 'John Smith', 'john.smith@example.com');
    tablero.registerParticipant(otroParticipante);
    expect(() => tablero.reserveNumber('2', '05')).toThrow('El número 05 ya está ocupado.');
  });

  it('debe lanzar un error al reservar un número para un participante no registrado', () => {
    expect(() => tablero.reserveNumber('99', '05')).toThrow('Participante no encontrado.');
  });

  it('debe lanzar un error al reservar un número de tablero inválido', () => {
    expect(() => tablero.reserveNumber('1', '100')).toThrow('Número de tablero inválido.');
  });

  it('debe liberar un número ocupado', () => {
    tablero.reserveNumber('1', '05');
    tablero.freeNumber('05');
    expect(tablero.getOccupiedNumbersCount()).toBe(0);
    expect(tablero.getFreeNumbersCount()).toBe(100);
  });

  it('debe lanzar un error al liberar un número no ocupado', () => {
    expect(() => tablero.freeNumber('05')).toThrow('El número 05 no está ocupado.');
  });

  it('debe lanzar un error al liberar un número de tablero inválido', () => {
    expect(() => tablero.freeNumber('100')).toThrow('Número de tablero inválido.');
  });

  it('debe obtener el ganador', () => {
    tablero.reserveNumber('1', '05');
    const ganador = tablero.getWinner('05');
    expect(ganador).toEqual(participante);
  });

  it('debe devolver nulo si el número ganador no está ocupado', () => {
    const ganador = tablero.getWinner('05');
    expect(ganador).toBeNull();
  });

  it('debe lanzar un error al obtener el ganador con un número de tablero inválido', () => {
    expect(() => tablero.getWinner('100')).toThrow('Número de tablero ganador inválido.');
  });
});
