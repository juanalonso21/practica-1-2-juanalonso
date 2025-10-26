import { Participant, Board, IParticipant, BoardNumber } from './classes';

const christmasRaffleBoard = new Board();
let selectedNumberForModal: string | null = null; // To store the number clicked on the board

// DOM Elements
const openRegisterParticipantModalBtn = document.getElementById('openRegisterParticipantModalBtn') as HTMLButtonElement;
const participantsList = document.getElementById('participantsList') as HTMLUListElement;

const boardGrid = document.getElementById('board') as HTMLDivElement;

const winningNumberInput = document.getElementById('winningNumberInput') as HTMLInputElement;
const drawWinnerBtn = document.getElementById('drawWinnerBtn') as HTMLButtonElement;
const winnerDisplay = document.getElementById('winnerDisplay') as HTMLDivElement;

const occupiedCountSpan = document.getElementById('occupiedCount') as HTMLSpanElement;
const freeCountSpan = document.getElementById('freeCount') as HTMLSpanElement;
const totalParticipantsSpan = document.getElementById('totalParticipants') as HTMLSpanElement;

// Register Participant Modal Elements
const registerParticipantModal = document.getElementById('registerParticipantModal') as HTMLDialogElement;
const modalParticipantNameInput = document.getElementById('modalParticipantName') as HTMLInputElement;
const modalParticipantEmailInput = document.getElementById('modalParticipantEmail') as HTMLInputElement;
const modalParticipantPhoneInput = document.getElementById('modalParticipantPhone') as HTMLInputElement;
const modalRegisterParticipantBtn = document.getElementById('modalRegisterParticipantBtn') as HTMLButtonElement;
const modalParticipantMessage = document.getElementById('modalParticipantMessage') as HTMLDivElement;

// Reserve Number Modal Elements
const reserveNumberModal = document.getElementById('reserveNumberModal') as HTMLDialogElement;
const modalNumberToReserveSpan = document.getElementById('modalNumberToReserve') as HTMLSpanElement;
const modalParticipantSelect = document.getElementById('modalParticipantSelect') as HTMLSelectElement;
const modalReserveExistingBtn = document.getElementById('modalReserveExistingBtn') as HTMLButtonElement;
const modalFreeNumberBtn = document.getElementById('modalFreeNumberBtn') as HTMLButtonElement;
const modalNewParticipantNameInput = document.getElementById('modalNewParticipantName') as HTMLInputElement;
const modalNewParticipantEmailInput = document.getElementById('modalNewParticipantEmail') as HTMLInputElement;
const modalNewParticipantPhoneInput = document.getElementById('modalNewParticipantPhone') as HTMLInputElement;
const modalReserveNewBtn = document.getElementById('modalReserveNewBtn') as HTMLButtonElement;
const modalReserveMessage = document.getElementById('modalReserveMessage') as HTMLDivElement;

// Close buttons for modals
document.querySelectorAll('[data-close-modal]').forEach(button => {
    button.addEventListener('click', (event) => {
        const modal = (event.target as HTMLElement).closest('dialog') as HTMLDialogElement;
        if (modal) {
            modal.close();
        }
    });
});

// Close modal when clicking outside (for <dialog> elements, use 'cancel' event or click on backdrop)
registerParticipantModal.addEventListener('click', (event) => {
    if (event.target === registerParticipantModal) {
        registerParticipantModal.close();
    }
});
reserveNumberModal.addEventListener('click', (event) => {
    if (event.target === reserveNumberModal) {
        reserveNumberModal.close();
    }
});

// Helper to display messages
function displayMessage(element: HTMLElement, message: string, isError: boolean = false) {
    element.textContent = message;
    element.className = isError ? 'message error' : 'message';
    setTimeout(() => {
        element.textContent = '';
        element.className = 'message';
    }, 3000);
}

// Persistence (localStorage)
const LOCAL_STORAGE_KEY = 'christmasRaffleBoardState';

function saveBoardState() {
    const state = {
        participants: Array.from(christmasRaffleBoard['participants'].values()),
        board: christmasRaffleBoard['board'],
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

function loadBoardState() {
    const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedState) {
        const state = JSON.parse(storedState);
        state.participants.forEach((p: IParticipant) => {
            try {
                const newParticipant = new Participant(p.id, p.name, p.email, p.phone);
                christmasRaffleBoard.registerParticipant(newParticipant);
            } catch (error) {
                console.error('Error loading participant from localStorage:', error);
            }
        });
        // Re-apply reservations to the board
        christmasRaffleBoard['board'].forEach((boardNum: BoardNumber) => {
            const storedBoardNum = state.board.find((sbn: BoardNumber) => sbn.number === boardNum.number);
            if (storedBoardNum) {
                boardNum.isOccupied = storedBoardNum.isOccupied;
                boardNum.participantId = storedBoardNum.participantId;
            }
        });
    }
}

// Render Functions
function renderParticipants() {
    participantsList.innerHTML = '';
    modalParticipantSelect.innerHTML = '<option value="">Select Participant</option>';
    const allParticipants = christmasRaffleBoard.getAllParticipants();
    // Sort participants by name
    allParticipants.sort((a, b) => a.name.localeCompare(b.name));

    allParticipants.forEach((p: IParticipant) => {
        const li = document.createElement('li');
        li.textContent = `${p.name} (${p.email})`;
        participantsList.appendChild(li);

        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.name;
        modalParticipantSelect.appendChild(option);
    });
}

function renderBoard() {
    boardGrid.innerHTML = '';
    christmasRaffleBoard.getBoardStatus().forEach((boardNumber: BoardNumber) => {
        const cell = document.createElement('div');
        cell.classList.add('board-cell');
        cell.dataset.number = boardNumber.number;

        const spanNumber = document.createElement('span');
        spanNumber.textContent = boardNumber.number;
        cell.appendChild(spanNumber);

        if (boardNumber.isOccupied) {
            cell.classList.add('occupied');
            const participant = christmasRaffleBoard.getParticipant(boardNumber.participantId!);
            if (participant) {
                const spanParticipant = document.createElement('span');
                spanParticipant.textContent = participant.name;
                spanParticipant.style.fontSize = '0.6em';
                spanParticipant.style.top = '70%';
                cell.appendChild(spanParticipant);
            }
        } else {
            cell.classList.add('free');
        }

        cell.addEventListener('click', () => {
            const numberClicked = boardNumber.number;
            selectedNumberForModal = numberClicked;
            modalNumberToReserveSpan.textContent = numberClicked;

            if (boardNumber.isOccupied) {
                const occupyingParticipant = christmasRaffleBoard.getParticipant(boardNumber.participantId!)
                if (occupyingParticipant) {
                    // If occupied, always give the option to free it.
                    modalReserveExistingBtn.style.display = 'none';
                    modalReserveNewBtn.style.display = 'none';
                    modalNewParticipantNameInput.style.display = 'none';
                    modalNewParticipantEmailInput.style.display = 'none';
                    modalNewParticipantPhoneInput.style.display = 'none';
                    modalParticipantSelect.style.display = 'none';
                    modalFreeNumberBtn.style.display = 'block';
                    displayMessage(modalReserveMessage, `Number ${numberClicked} is occupied by ${occupyingParticipant.name}. Click 'Free Number' to release it.`);
                    reserveNumberModal.showModal();
                }
            } else {
                // If free, open the reservation modal with reservation options
                modalReserveExistingBtn.style.display = 'block';
                modalReserveNewBtn.style.display = 'block';
                modalNewParticipantNameInput.style.display = 'block';
                modalNewParticipantEmailInput.style.display = 'block';
                modalNewParticipantPhoneInput.style.display = 'block';
                modalParticipantSelect.style.display = 'block';
                modalFreeNumberBtn.style.display = 'none';
                reserveNumberModal.showModal(); // Use showModal for <dialog>
                renderParticipants(); // Refresh participant list in modal
            }
        });

        boardGrid.appendChild(cell);
    });
}

function updateStatistics() {
    occupiedCountSpan.textContent = christmasRaffleBoard.getOccupiedNumbersCount().toString();
    freeCountSpan.textContent = christmasRaffleBoard.getFreeNumbersCount().toString();
    totalParticipantsSpan.textContent = christmasRaffleBoard.getAllParticipants().length.toString();
}

// Event Listeners for Modals
openRegisterParticipantModalBtn.addEventListener('click', () => {
    registerParticipantModal.showModal(); // Use showModal for <dialog>
    modalParticipantNameInput.value = '';
    modalParticipantEmailInput.value = '';
    modalParticipantPhoneInput.value = '';
    modalParticipantMessage.textContent = '';
});

modalRegisterParticipantBtn.addEventListener('click', () => {
    const id = Date.now().toString();
    const name = modalParticipantNameInput.value;
    const email = modalParticipantEmailInput.value;
    const phone = modalParticipantPhoneInput.value;

    try {
        const newParticipant = new Participant(id, name, email, phone);
        christmasRaffleBoard.registerParticipant(newParticipant);
        displayMessage(modalParticipantMessage, `Participant ${name} registered successfully!`);
        modalParticipantNameInput.value = '';
        modalParticipantEmailInput.value = '';
        modalParticipantPhoneInput.value = '';
        renderParticipants();
        updateStatistics();
        saveBoardState();
    } catch (error: any) {
        displayMessage(modalParticipantMessage, error.message, true);
    }
});

modalReserveExistingBtn.addEventListener('click', () => {
    const participantId = modalParticipantSelect.value;
    if (!participantId || !selectedNumberForModal) {
        displayMessage(modalReserveMessage, 'Please select a participant and ensure a number is selected.', true);
        return;
    }

    try {
        christmasRaffleBoard.reserveNumber(participantId, selectedNumberForModal);
        displayMessage(modalReserveMessage, `Number ${selectedNumberForModal} reserved for ${christmasRaffleBoard.getParticipant(participantId)?.name}!`);
        reserveNumberModal.close(); // Use close for <dialog>
        renderBoard();
        updateStatistics();
        saveBoardState();
    } catch (error: any) {
        displayMessage(modalReserveMessage, error.message, true);
    }
});

modalFreeNumberBtn.addEventListener('click', () => {
    if (!selectedNumberForModal) {
        displayMessage(modalReserveMessage, 'No number selected to free.', true);
        return;
    }
    try {
        christmasRaffleBoard.freeNumber(selectedNumberForModal);
        displayMessage(modalReserveMessage, `Number ${selectedNumberForModal} freed successfully!`);
        reserveNumberModal.close(); // Use close for <dialog>
        renderBoard();
        updateStatistics();
        saveBoardState();
    } catch (error: any) {
        displayMessage(modalReserveMessage, error.message, true);
    }
});

modalReserveNewBtn.addEventListener('click', () => {
    const id = Date.now().toString();
    const name = modalNewParticipantNameInput.value;
    const email = modalNewParticipantEmailInput.value;
    const phone = modalNewParticipantPhoneInput.value;

    if (!selectedNumberForModal) {
        displayMessage(modalReserveMessage, 'No number selected for reservation.', true);
        return;
    }

    try {
        const newParticipant = new Participant(id, name, email, phone);
        christmasRaffleBoard.registerParticipant(newParticipant);
        christmasRaffleBoard.reserveNumber(newParticipant.id, selectedNumberForModal);
        displayMessage(modalReserveMessage, `New participant ${name} registered and number ${selectedNumberForModal} reserved!`);
        reserveNumberModal.close(); // Use close for <dialog>
        renderParticipants();
        renderBoard(); // Re-render the board to show the new occupied number
        updateStatistics();
        saveBoardState();
    } catch (error: any) {
        displayMessage(modalReserveMessage, error.message, true);
    }
});

drawWinnerBtn.addEventListener('click', () => {
    const winningNumber = winningNumberInput.value.padStart(2, '0');

    if (winningNumber.length !== 2 || isNaN(parseInt(winningNumber))) {
        displayMessage(winnerDisplay, 'Please enter a valid 2-digit winning number (e.g., 05, 99).', true);
        return;
    }

    try {
        const winner = christmasRaffleBoard.getWinner(winningNumber);
        if (winner) {
            displayMessage(winnerDisplay, `The winner is: ${winner.name} (${winner.email})!`);
        } else {
            displayMessage(winnerDisplay, `Number ${winningNumber} is not occupied. The house wins!`);
        }
    } catch (error: any) {
        displayMessage(winnerDisplay, error.message, true);
    }
});

// Initial Load and Render
loadBoardState();
renderParticipants();
renderBoard();
updateStatistics();