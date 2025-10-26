# Christmas Raffle Board Application

This is a TypeScript application for managing a Christmas raffle board with 100 numbers (00-99). Participants can reserve numbers, and the system determines a winner based on a winning number.

## Features

*   **Participant Management:** Register, list, and manage participant information.
*   **Board Management:** Initialize, display, reserve, and free up numbers on the board.
*   **Winner Determination:** Identify the winner based on a given winning number.
*   **Statistics:** View occupied/free numbers, total participants, and participant-specific reservations.

## Technical Stack

*   **Language:** TypeScript
*   **Testing Framework:** Jest
*   **Runtime:** Node.js

## Setup and Installation

1.  **Clone the repository (if applicable):**
    ```bash
    # git clone <repository-url>
    # cd <repository-directory>
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd tablero
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

## Available Scripts

In the project directory, you can run:

### `npm test`

Runs the unit tests using Jest. This will execute all `.test.ts` files in the `tests` directory.

### `npm run build`

Compiles the TypeScript code from `src` into JavaScript in the `dist` directory.

### `npm start`

Compiles and then runs the `index.js` file from the `dist` directory. This will execute the example usage of the raffle board.

## Project Structure

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
