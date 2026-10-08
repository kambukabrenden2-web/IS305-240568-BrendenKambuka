class User {
  #userId;
  #firstName;
  #lastName;
  #email;
  #userType;

  constructor(userId, firstName, lastName, email, userType = 'Student') {
    this.#userId = userId;
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#email = email;
    this.#userType = userType;
    this.validate();
  }

  get userId() { return this.#userId; }
  get firstName() { return this.#firstName; }
  get lastName() { return this.#lastName; }
  get email() { return this.#email; }
  get userType() { return this.#userType; }

  validate() {
    if (!this.#userId || String(this.#userId).trim() === '') throw new Error('User ID is missing.');
    if (!this.#firstName || this.#firstName.trim() === '') throw new Error('First name is missing.');
    if (!this.#lastName || this.#lastName.trim() === '') throw new Error('Last name is missing.');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.#email || !emailRegex.test(this.#email)) throw new Error('Invalid email address format.');
  }

  getFullName() {
    return `${this.#firstName} ${this.#lastName}`;
  }

  displayInfo() {
    return `ID: ${this.#userId} | Name: ${this.getFullName()} | Email: ${this.#email} | Type: ${this.#userType}`;
  }

  toJSON() {
    return {
      userId: this.#userId,
      firstName: this.#firstName,
      lastName: this.#lastName,
      email: this.#email,
      userType: this.#userType
    };
  }
}

module.exports = User;