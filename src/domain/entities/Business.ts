import { v4 as uuidv4 } from 'uuid';
import { Password } from '../Password';
import { sign, verify } from 'jsonwebtoken';
import { Email } from '../Email';

class Business {

  private email: Email;
  password: Password;

  constructor(
    readonly businessId: string,
    readonly name: string,
    email: string,
    readonly cpf: string,
    password: string,
    readonly city: string,
    readonly district: string,
    readonly addressNumber: number,
    readonly description: string,
    readonly logo: string
  ) {
    if (name === '') {
      throw new Error('O nome é obrigatório.');
    }
    if (email === '') {
      throw new Error('O e-mail é obrigatório.');
    }
    if (cpf === '') {
      throw new Error('O cpf é obrigatório.');
    }
    if (password === '') {
      throw new Error('A senha é obrigatória.');
    }
    if (city === '') {
      throw new Error('A cidade é obrigatório.');
    }
    if (district === '') {
      throw new Error('O bairro é obrigatório.');
    }
    if (description === '') {
      throw new Error('A descricao é obrigatório.');
    }
    this.email = new Email(email);
    this.password = new Password(password);
  }

  static create(
    name: string,
    email: string,
    cpf: string,
    password: string,
    city: string,
    district: string,
    addressNumber: number,
    description: string,
    logo: string
  ) {
    const businessId = uuidv4();
    return new Business(
      businessId,
      name,
      email,
      cpf,
      password,
      city,
      district,
      addressNumber,
      description,
      logo
    );
  }

  generateToken() {
    const payload = {
      businessId: this.businessId,
      name: this.name,
      email: this.email,
      cpf: this.cpf,
      city: this.city,
      district: this.district,
      addressNumber: this.addressNumber,
      logo: this.logo
    }
    const token = sign(payload, 'webdesign', { algorithm: 'HS256' });
    return token;
  }

  verifyToken(token: string) {
    return verify(token, 'webdesign');
  }

  validateToken() {
    const token = this.generateToken();
    if (token !== this.verifyToken(token)) {
      throw new Error('Token inválido, faça login novamente.');
    }
  }

  getEmail() {
    return this.email.getValue();
  }

  getPassword() {
    return this.password.getValue();
  }

}

export { Business }

