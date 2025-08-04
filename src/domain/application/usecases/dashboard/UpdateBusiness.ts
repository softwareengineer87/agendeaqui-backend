import { DatabaseConnection } from "../../../../infra/database/PgPromiseAdapter";
import { Business } from "../../../entities/Business";

class UpdateBusiness {

  constructor(readonly connection: DatabaseConnection) { }

  async execute(
    business_id: string,
    name: string,
    email: string,
    password: string,
    city: string,
    district: string,
    addressNumber: number,
    description: string,
    logo: string
  ): Promise<Output> {
    const business = Business.create(
      name, email, password, city, district,
      addressNumber, description, logo
    );
    const hashPass = await business.password.emcryptPassword(password);

    await this.connection.query(`UPDATE business SET
    name = $1, email = $2, password = $3, city = $4, district = $5, 
    address_number= $6, description = $7, logo = $8
    WHERE business_id = $9`, [business.name, business.getEmail(),
      hashPass, business.city, business.district,
    business.addressNumber, business.description,
    business.logo, business_id]);

    return {
      businessId: business_id
    }
  }

}

type Output = {
  businessId: string;
}

export { UpdateBusiness }

