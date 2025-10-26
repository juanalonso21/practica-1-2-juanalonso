"use strict";
class Participant {
    constructor(id, name, email, phone) {
        if (!id || !name) {
            throw new Error("Participant must have an id and name.");
        }
        if (!email) {
            throw new Error("Participant must have an email.");
        }
        if (!this.isValidEmail(email)) {
            throw new Error("Invalid email format.");
        }
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
    isValidEmail(email) {
        const emailRegex = /^[^@ ]+@[^@ ]+\.[^@ ]+$/;
        return emailRegex.test(email);
    }
    updateContactInfo(email, phone) {
        if (!this.isValidEmail(email)) {
            throw new Error("Invalid email format.");
        }
        this.email = email;
        this.phone = phone;
    }
    getParticipantInfo() {
        return { id: this.id, name: this.name, email: this.email, phone: this.phone };
    }
}
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
const christmasRaffleBoard = new Board();
let selectedNumberForModal = null; // To store the number clicked on the board
// DOM Elements
const openRegisterParticipantModalBtn = document.getElementById('openRegisterParticipantModalBtn');
const participantsList = document.getElementById('participantsList');
const boardGrid = document.getElementById('board');
const winningNumberInput = document.getElementById('winningNumberInput');
const drawWinnerBtn = document.getElementById('drawWinnerBtn');
const winnerDisplay = document.getElementById('winnerDisplay');
const occupiedCountSpan = document.getElementById('occupiedCount');
const freeCountSpan = document.getElementById('freeCount');
const totalParticipantsSpan = document.getElementById('totalParticipants');
// Register Participant Modal Elements
const registerParticipantModal = document.getElementById('registerParticipantModal');
const modalParticipantNameInput = document.getElementById('modalParticipantName');
const modalParticipantEmailInput = document.getElementById('modalParticipantEmail');
const modalParticipantPhoneInput = document.getElementById('modalParticipantPhone');
const modalRegisterParticipantBtn = document.getElementById('modalRegisterParticipantBtn');
const modalParticipantMessage = document.getElementById('modalParticipantMessage');
// Reserve Number Modal Elements
const reserveNumberModal = document.getElementById('reserveNumberModal');
const modalNumberToReserveSpan = document.getElementById('modalNumberToReserve');
const modalParticipantSelect = document.getElementById('modalParticipantSelect');
const modalReserveExistingBtn = document.getElementById('modalReserveExistingBtn');
const modalFreeNumberBtn = document.getElementById('modalFreeNumberBtn');
const modalNewParticipantNameInput = document.getElementById('modalNewParticipantName');
const modalNewParticipantEmailInput = document.getElementById('modalNewParticipantEmail');
const modalNewParticipantPhoneInput = document.getElementById('modalNewParticipantPhone');
const modalReserveNewBtn = document.getElementById('modalReserveNewBtn');
const modalReserveMessage = document.getElementById('modalReserveMessage');
// Close buttons for modals
document.querySelectorAll('[data-close-modal]').forEach(button => {
    button.addEventListener('click', (event) => {
        const modal = event.target.closest('dialog');
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
function displayMessage(element, message, isError = false) {
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
        state.participants.forEach((p) => {
            try {
                const newParticipant = new Participant(p.id, p.name, p.email, p.phone);
                christmasRaffleBoard.registerParticipant(newParticipant);
            }
            catch (error) {
                console.error('Error loading participant from localStorage:', error);
            }
        });
        // Re-apply reservations to the board
        christmasRaffleBoard['board'].forEach((boardNum) => {
            const storedBoardNum = state.board.find((sbn) => sbn.number === boardNum.number);
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
    allParticipants.forEach((p) => {
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
    christmasRaffleBoard.getBoardStatus().forEach((boardNumber) => {
        const cell = document.createElement('div');
        cell.classList.add('board-cell');
        cell.dataset.number = boardNumber.number;
        const spanNumber = document.createElement('span');
        spanNumber.textContent = boardNumber.number;
        cell.appendChild(spanNumber);
        if (boardNumber.isOccupied) {
            cell.classList.add('occupied');
            const participant = christmasRaffleBoard.getParticipant(boardNumber.participantId);
            if (participant) {
                const spanParticipant = document.createElement('span');
                spanParticipant.textContent = participant.name;
                spanParticipant.style.fontSize = '0.6em';
                spanParticipant.style.top = '70%';
                cell.appendChild(spanParticipant);
            }
        }
        else {
            cell.classList.add('free');
        }
        cell.addEventListener('click', () => {
            const numberClicked = boardNumber.number;
            selectedNumberForModal = numberClicked;
            modalNumberToReserveSpan.textContent = numberClicked;
            if (boardNumber.isOccupied) {
                const occupyingParticipant = christmasRaffleBoard.getParticipant(boardNumber.participantId);
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
            }
            else {
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
    }
    catch (error) {
        displayMessage(modalParticipantMessage, error.message, true);
    }
});
modalReserveExistingBtn.addEventListener('click', () => {
    var _a;
    const participantId = modalParticipantSelect.value;
    if (!participantId || !selectedNumberForModal) {
        displayMessage(modalReserveMessage, 'Please select a participant and ensure a number is selected.', true);
        return;
    }
    try {
        christmasRaffleBoard.reserveNumber(participantId, selectedNumberForModal);
        displayMessage(modalReserveMessage, `Number ${selectedNumberForModal} reserved for ${(_a = christmasRaffleBoard.getParticipant(participantId)) === null || _a === void 0 ? void 0 : _a.name}!`);
        reserveNumberModal.close(); // Use close for <dialog>
        renderBoard();
        updateStatistics();
        saveBoardState();
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
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
        }
        else {
            displayMessage(winnerDisplay, `Number ${winningNumber} is not occupied. The house wins!`);
        }
    }
    catch (error) {
        displayMessage(winnerDisplay, error.message, true);
    }
});
// Initial Load and Render
loadBoardState();
renderParticipants();
renderBoard();
updateStatistics();
//# sourceMappingURL=script.js.map