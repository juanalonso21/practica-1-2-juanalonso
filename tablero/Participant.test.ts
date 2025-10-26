import { Participant } from './classes';

describe('Participante', () => {
  it('debe crear un participante con datos válidos', () => {
    const participante = new Participant('1', 'John Doe', 'john.doe@example.com');
    expect(participante.getParticipantInfo()).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: undefined,
    });
  });

  it('debe lanzar un error si falta el id o el nombre', () => {
    expect(() => new Participant('', 'John Doe', 'john.doe@example.com')).toThrow('El participante debe tener un id y un nombre.');
    expect(() => new Participant('1', '', 'john.doe@example.com')).toThrow('El participante debe tener un id y un nombre.');
  });

  it('debe crear un participante con un correo electrónico con subdominio', () => {
    const participante = new Participant('1', 'John Doe', 'john.doe@sub.example.com');
    expect(participante.getParticipantInfo().email).toBe('john.doe@sub.example.com');
  });

  it('debe crear un participante con un correo electrónico con el signo +', () => {
    const participante = new Participant('1', 'John Doe', 'john.doe+alias@example.com');
    expect(participante.getParticipantInfo().email).toBe('john.doe+alias@example.com');
  });

  it('debe lanzar un error por un correo electrónico inválido', () => {
    expect(() => new Participant('1', 'John Doe', 'invalid-email')).toThrow('Formato de correo electrónico inválido.');
    expect(() => new Participant('1', 'John Doe', 'test@')).toThrow('Formato de correo electrónico inválido.');
    expect(() => new Participant('1', 'John Doe', 'test@domain')).toThrow('Formato de correo electrónico inválido.');
    expect(() => new Participant('1', 'John Doe', 'test@domain.')).toThrow('Formato de correo electrónico inválido.');
    expect(() => new Participant('1', 'John Doe', '@domain.com')).toThrow('Formato de correo electrónico inválido.');
    expect(() => new Participant('1', 'John Doe', 'test@domain .com')).toThrow('Formato de correo electrónico inválido.');
  });

  it('debe lanzar un error si el correo electrónico está vacío', () => {
    expect(() => new Participant('1', 'John Doe', '')).toThrow('El participante debe tener un correo electrónico.');
  });

  it('debe actualizar la información de contacto', () => {
    const participante = new Participant('1', 'John Doe', 'john.doe@example.com');
    participante.updateContactInfo('new.email@example.com', '123456789');
    expect(participante.getParticipantInfo()).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'new.email@example.com',
      phone: '123456789',
    });
  });

  it('debe lanzar un error al actualizar con un correo electrónico inválido', () => {
    const participante = new Participant('1', 'John Doe', 'john.doe@example.com');
    expect(() => participante.updateContactInfo('invalid-email')).toThrow('Formato de correo electrónico inválido.');
  });
});
