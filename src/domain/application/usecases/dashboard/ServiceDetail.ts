import { BusinessRepository } from "../../../../infra/repository/BusinessRepository";
import { Service } from "../../../entities/Service";

class ServiceDetail {

  constructor(readonly businessRepository: BusinessRepository) { }

  async execute(serviceId: string): Promise<Service> {
    const service = await this.businessRepository.serviceDetail(serviceId);
    if (!service) {
      throw new Error('Serviço não encontrado.');
    }

    return service;
  }

}

export { ServiceDetail }

