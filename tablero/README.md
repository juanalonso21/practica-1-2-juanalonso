# Aplicación de Tablero de Rifa de Navidad

Esta es una aplicación de TypeScript para gestionar un tablero de rifa de Navidad con 100 números (del 00 al 99). Los participantes pueden reservar números y el sistema determina un ganador en función de un número ganador.

## Características

*   **Gestión de Participantes:** Registrar, listar y gestionar la información de los participantes.
*   **Gestión del Tablero:** Inicializar, mostrar, reservar y liberar números en el tablero.
*   **Determinación del Ganador:** Identificar al ganador en función de un número ganador determinado.
*   **Estadísticas:** Ver los números ocupados/libres, el total de participantes y las reservas específicas de los participantes.

## Cómo Iniciar la Aplicación

1.  **Clona el repositorio (si es aplicable):**
    ```bash
    # git clone <URL-del-repositorio>
    # cd <directorio-del-repositorio>
    ```

2.  **Navega al directorio del proyecto:**
    ```bash
    cd tablero
    ```

3.  **Instala las dependencias:**
    ```bash
    npm install
    ```

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm test`

Ejecuta las pruebas unitarias utilizando Jest. Esto ejecutará todos los archivos `.test.ts` en el directorio `tests`.

### `npm run build`

Compila el código TypeScript de `src` a JavaScript en el directorio `dist`.

### `npm start`

Compila y luego ejecuta el archivo `index.js` desde el directorio `dist`. Esto ejecutará el ejemplo de uso del tablero de la rifa.

## Clases y Métodos

### `Participant`

Representa a un participante en la rifa.

*   `constructor(id: string, name: string, email: string, phone?: string)`: Crea una nueva instancia de `Participant`.
*   `updateContactInfo(email: string, phone?: string)`: Actualiza la información de contacto del participante.
*   `getParticipantInfo(): IParticipant`: Devuelve la información del participante.

### `Board`

Representa el tablero de la rifa.

*   `constructor()`: Crea una nueva instancia de `Board` e inicializa el tablero.
*   `registerParticipant(participant: IParticipant)`: Registra a un nuevo participante.
*   `getParticipant(participantId: string): IParticipant | undefined`: Devuelve un participante por su ID.
*   `getAllParticipants(): IParticipant[]`: Devuelve una lista de todos los participantes.
*   `reserveNumber(participantId: string, boardNumber: string)`: Reserva un número para un participante.
*   `freeNumber(boardNumber: string)`: Libera un número.
*   `getBoardStatus(): BoardNumber[]`: Devuelve el estado actual del tablero.
*   `getOccupiedNumbersCount(): number`: Devuelve el número de números ocupados.
*   `getFreeNumbersCount(): number`: Devuelve el número de números libres.
*   `getParticipantNumbers(participantId: string): string[]`: Devuelve los números reservados por un participante.
*   `getWinner(winningNumber: string): IParticipant | null`: Devuelve al ganador de la rifa.

## Estructura del Proyecto

```
.
├── src/
│   ├── Board.ts
│   ├── Participant.ts
│   └── index.ts
├── tests/
│   ├── Board.test.ts
│   └── Participant.test.ts
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```