class Email {
  private value: string;

  constructor(email: string) {
    if (!email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/)) {
      throw new Error('Email inválido.');
    }
    if (email === '') {
      throw new Error('O email é obrigatório!');
    }
    this.value = email;
  }

  getValue() {
    return this.value;
  }
}

export { Email }
