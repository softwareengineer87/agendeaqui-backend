import { Customer } from "../../domain/entities/Customer";
import { Schedule } from "../../domain/entities/Schedule";
import { DatabaseConnection } from "../database/PgPromiseAdapter";

interface CustomerRepository {
  saveCustomer(
    customerId: string,
    name: string,
    email: string,
    password: string,
    phone: string,
  ): Promise<void>;
  getByEmail(email: string): Promise<Customer | null>;
  saveSchedule(schedule: Schedule): Promise<void>;
  scheduleDetail(scheduleId: string): Promise<Schedule>;
}

class CustomerRepositoryDatabase implements CustomerRepository {

  constructor(readonly connection: DatabaseConnection) { }

  async saveCustomer(
    customerId: string,
    name: string,
    email: string,
    password: string,
    phone: string,
  ): Promise<void> {
    await this.connection.query(`INSERT INTO customers
    (customer_id, name, email, password, phone)
    VALUES($1,$2,$3,$4,$5)`, [
      customerId, name, email, password, phone
    ]);
  }

  async getByEmail(email: string): Promise<Customer | null> {
    const [customerData] = await this.connection.query(`SELECT * FROM customers 
    WHERE email = $1`, [email]);
    if (customerData) {
      return new Customer(customerData.customer_id, customerData.name,
        customerData.email, customerData.password, customerData.phone,
      )
    }

    return null;
  }

  async saveSchedule(schedule: Schedule): Promise<void> {
    await this.connection.query(`INSERT INTO schedules
    (schedule_id, service_id, customer_id, business_id, 
    status, schedule_hour, schedule_date)
    VALUES($1,$2,$3,$4,$5,$6,$7)`, [
      schedule.scheduleId, schedule.serviceId, schedule.customerId,
      schedule.businessId, schedule.getStatus(),
      schedule.scheduleHour, schedule.scheduleDate]);
  }

  async scheduleDetail(scheduleId: string): Promise<Schedule> {
    const [scheduleData] = await this.connection.query(`SELECT * FROM schedules
    WHERE schedule_id = $1`, [scheduleId]);

    return new Schedule(
      scheduleData.schedule_id,
      scheduleData.service_id,
      scheduleData.customer_id,
      scheduleData.business_id,
      scheduleData.status,
      scheduleData.schedule_hour,
      scheduleData.schedule_date
    );
  }

}

export {
  CustomerRepository,
  CustomerRepositoryDatabase
}

