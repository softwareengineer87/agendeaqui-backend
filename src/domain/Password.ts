import { compare, hash } from 'bcrypt';

class Password {
  value: string;

  constructor(password: string) {
    if (password === '') {
      throw new Error('A senha é obrigatória.');
    }
    this.value = password;
  }

  async emcryptPassword(plainPassword: string) {
    const salt = 10;
    return await hash(plainPassword, salt);
  }

  async decryptPassword(plainPassword: string, hashPassword: string) {
    return await compare(plainPassword, hashPassword);
  }

  getValue() {
    return this.value;
  }
}

export { Password }

