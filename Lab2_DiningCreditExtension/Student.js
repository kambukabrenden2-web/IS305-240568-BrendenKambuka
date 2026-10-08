// Student.js
class Student {
  #studentId;
  #firstName;
  #lastName;

  constructor(studentId, firstName, lastName) {
    this.studentId = studentId;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // --- Getters ---
  get studentId() {
    return this.#studentId;
  }

  get firstName() {
    return this.#firstName;
  }

  get lastName() {
    return this.#lastName;
  }

  // --- Controlled Setters with Validation ---
  set studentId(id) {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Student ID cannot be empty.');
    }
    this.#studentId = id.trim();
  }

  set firstName(fName) {
    if (!fName || typeof fName !== 'string' || fName.trim() === '') {
      throw new Error('First name cannot be empty.');
    }
    this.#firstName = fName.trim();
  }

  set lastName(lName) {
    if (!lName || typeof lName !== 'string' || lName.trim() === '') {
      throw new Error('Last name cannot be empty.');
    }
    this.#lastName = lName.trim();
  }

  // --- Required Methods ---
  getFullName() {
    return `${this.#firstName} ${this.#lastName}`;
  }

  displayInfo() {
    console.log('========================================');
    console.log('          STUDENT INFORMATION           ');
    console.log('========================================');
    console.log(`Student ID: ${this.#studentId}`);
    console.log(`Student Name: ${this.getFullName()}`);
    console.log('========================================');
  }
}

export default Student;