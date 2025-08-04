import { CustomerRepository } from "../../../../infra/repository/CustomerRepository";

class Login {

  constructor(readonly customerRepository: CustomerRepository) { }

  async execute(email: string, password: string): Promise<any> {
    const customer = await this.customerRepository.getByEmail(email);
    if (!customer) {
      throw new Error('Cliente não encontrado, verifique as informações.');
    }

    const mathPassword = await customer.password.decryptPassword(password, customer.getPassword());
    if (!mathPassword) {
      throw new Error('Email ou senha inválidos, tente novamente.');
    }

    const token = customer.generateToken();
    const payload = customer.verifyToken(token);

    return {
      token,
      payload
    }

  }

}

export { Login }

