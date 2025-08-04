import { DatabaseConnection } from "../../../../infra/database/PgPromiseAdapter";

class UpdateService {

  constructor(readonly connection: DatabaseConnection) { }

  async execute(
    serviceId: string,
    serviceTitle: string,
    price: number,
  ) {
    await this.connection.query(`UPDATE services SET 
    service_title = $1, price = $2 
    WHERE service_id = $3`, [
      serviceTitle, price, serviceId
    ]);
  }

}

export { UpdateService }

