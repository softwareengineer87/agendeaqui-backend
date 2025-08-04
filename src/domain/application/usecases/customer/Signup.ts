import { CustomerRepository } from "../../../../infra/repository/CustomerRepository";
import { Customer } from "../../../entities/Customer";

class Signup {

  constructor(readonly customerRepository: CustomerRepository) { }

  async execute(input: Input): Promise<Output> {
    const customerData = await this.customerRepository.getByEmail(input.email);
    if (customerData) {
      throw new Error('Este email já está cadastrado no sistema, tente outro.');
    }
    const customer = Customer.create(
      input.name,
      input.email,
      input.password,
      input.phone,
    );
    const hashPass = await customer.password.emcryptPassword(input.password);
    const token = customer.generateToken();
    await this.customerRepository.saveCustomer(
      customer.customerId, customer.name, customer.getEmail(),
      hashPass, customer.phone
    );

    return {
      customerId: customer.customerId,
      token
    }
  }

}

type Input = {
  name: string,
  email: string,
  password: string,
  phone: string,
}

type Output = {
  customerId: string,
  token: string
}

export { Signup }

