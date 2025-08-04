import { DatabaseConnection } from "../../../../infra/database/PgPromiseAdapter";
import { Service } from "../../../entities/Service";

class AllServices {

  constructor(readonly connection: DatabaseConnection) { }

  async execute(businessId: string): Promise<Service[]> {
    const services = await this.connection.query(`SELECT s.*, 
    b.name as business_name, b.email, b.district, 
    b.description, b.logo 
    FROM services as s
    JOIN business AS b ON s.business_id = b.business_id
    WHERE b.business_id = $1
    `, [businessId]);

    return services;
  }

}

export { AllServices }

