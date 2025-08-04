import { DatabaseConnection } from "../../../../infra/database/PgPromiseAdapter";
import { Schedule } from "../../../entities/Schedule";

type ScheduleDetailType = {
  customerName: string;
  customerEmail: string;
  phone: string;
  serviceTitle: string;
  price: number;
  businessName: string;
  businessEmail: string;
  scheduleHour: string;
  scheduleDate: Date;
}

class ScheduleDetail {

  constructor(readonly connection: DatabaseConnection) { }

  async execute(scheduleId: string): Promise<ScheduleDetailType> {
    const [scheduleData] = await this.connection.query(`
    SELECT s.schedule_id, s.schedule_hour, s.schedule_date, 
    s.status, c.name, c.email, c.phone, se.service_title,
    se.price, b.name AS business_name, 
    b.email AS business_email
    FROM schedules AS s
    JOIN customers AS c ON (c.customer_id = s.customer_id)  
    JOIN services AS se ON (se.service_id = s.service_id)
    JOIN business AS b ON (b.business_id = s.business_id)
    WHERE schedule_id = $1
`, [scheduleId]);
    return scheduleData;
  }

}

export { ScheduleDetail }

