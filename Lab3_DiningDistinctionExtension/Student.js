import DiningAccount from "./DiningAccount.js";

class Student {
    #studentId;
    #name;
    #diningAccount;

    constructor(studentId, name) {
        if (!studentId || studentId.trim() === "") {
            throw new Error("Student ID cannot be empty.");
        }
        if (!name || name.trim() === "") {
            throw new Error("Student name cannot be empty.");
        }
        this.#studentId = studentId;
        this.#name = name;
        this.#diningAccount = null;
    }

    get studentId() {
        return this.#studentId;
    }

    get name() {
        return this.#name;
    }

    get diningAccount() {
        return this.#diningAccount;
    }

    assignDiningAccount(account) {
        if (!(account instanceof DiningAccount)) {
            throw new Error("Invalid account supplied. Must be an instance of DiningAccount or its subclasses.");
        }
        this.#diningAccount = account;
    }
}

export default Student;