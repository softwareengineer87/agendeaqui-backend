import { DatabaseConnection } from "../../../../infra/database/PgPromiseAdapter";

class DeleteService {

  constructor(readonly connection: DatabaseConnection) { }

  async execute(serviceId: string): Promise<void> {
    await this.connection.query(`DELETE FROM services
    WHERE service_id = $1`, [serviceId]);
  }

}

export { DeleteService }

