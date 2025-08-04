import { CustomerRepository } from "../../../../infra/repository/CustomerRepository";
import { Schedule } from "../../../entities/Schedule";

class CreateSchedule {

  constructor(readonly customerRepository: CustomerRepository) { }

  async execute(input: Input): Promise<Output> {
    const schedule = Schedule.create(
      input.serviceId,
      input.customerId,
      input.businessId,
      input.scheduleHour,
      input.scheduleDate
    );
    await this.customerRepository.saveSchedule(schedule);

    return {
      scheduleId: schedule.scheduleId
    }
  }

}

type Input = {
  serviceId: string;
  customerId: string;
  businessId: string;
  scheduleHour: string;
  scheduleDate: Date;
}

type Output = {
  scheduleId: string;
}

export { CreateSchedule }

