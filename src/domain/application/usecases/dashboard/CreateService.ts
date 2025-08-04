import { BusinessRepository } from "../../../../infra/repository/BusinessRepository";
import { Service } from "../../../entities/Service";

class CreateService {

  constructor(readonly businessRepository: BusinessRepository) { }

  async execute(input: Input): Promise<Output> {
    const service = Service.create(
      input.businessId,
      input.serviceTitle,
      input.price,
      input.startHour
    )
    await this.businessRepository.saveService(service);

    return {
      serviceId: service.serviceId
    }
  }

}

type Input = {
  businessId: string;
  serviceTitle: string;
  price: number;
  startHour: string;
}

type Output = {
  serviceId: string;
}

export { CreateService }

