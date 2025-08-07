import { CustomerRepository } from "../../../../infra/repository/CustomerRepository";

class DeleteSchedule {

  customerRepository: CustomerRepository;

  constructor(customerRepository: CustomerRepository) {
    this.customerRepository = customerRepository;
  }

  async execute(
    scheduleId: string
  ): Promise<Output> {
    await this.customerRepository.deleteSchedule(scheduleId);

    return {
      scheduleId
    }
  }

}

type Output = {
  scheduleId: string;
}

export { DeleteSchedule }

