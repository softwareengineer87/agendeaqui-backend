import { DatabaseConnection } from "../../../../infra/database/PgPromiseAdapter";
import { Schedule } from "../../../entities/Schedule";

class GetSchedulesByCustomerId {

  constructor(readonly connection: DatabaseConnection) { }

  async execute(customerId: string): Promise<Schedule[]> {
    const schedules = this.connection.query(`SELECT s.*, se.service_title,
    se.price
    FROM schedules AS s
    JOIN services AS se ON (se.service_id = s.service_id)
    WHERE customer_id = $1`, customerId);

    return schedules;
  }

}

export { GetSchedulesByCustomerId }

