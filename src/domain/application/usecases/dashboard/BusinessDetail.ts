import { BusinessRepository } from "../../../../infra/repository/BusinessRepository";
import { Business } from "../../../entities/Business";

class BusinessDetail {

  constructor(readonly businessRepository: BusinessRepository) { }

  async execute(businessId: string): Promise<Output> {
    const business = await this.businessRepository.businessDetail(businessId);
    return {
      businessId: business.businessId,
      name: business.name,
      email: business.getEmail(),
      password: business.password.getValue(),
      city: business.city,
      district: business.district,
      addressNumber: business.addressNumber,
      logo: business.logo
    }
  }

}

type Output = {
  businessId: string;
  name: string;
  email: string;
  password: string;
  city: string;
  district: string;
  addressNumber: number;
  logo: string;
}

export { BusinessDetail }

