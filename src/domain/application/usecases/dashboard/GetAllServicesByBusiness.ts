import { DatabaseConnection } from "../../../../infra/database/PgPromiseAdapter";
import { Service } from "../../../entities/Service";

class GetAllServicesByBusiness {

  constructor(readonly connection: DatabaseConnection) { }

  async execute(
    businessId: string,
    limit: number,
    offset: number
  ): Promise<Service[]> {
    const services = await this.connection.query(`SELECT s.*, 
    b.name as business_name, b.email 
    FROM services as s
    JOIN business AS b ON s.business_id = b.business_id
    WHERE b.business_id = $1
    LIMIT $2 OFFSET $3`, [businessId, limit, offset]);

    return services;
  }

}

export { GetAllServicesByBusiness }

