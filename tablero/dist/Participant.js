"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Participant = void 0;
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
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
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
exports.Participant = Participant;
//# sourceMappingURL=Participant.js.map