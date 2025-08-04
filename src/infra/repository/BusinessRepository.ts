import { Business } from "../../domain/entities/Business";
import { Service } from "../../domain/entities/Service";
import { DatabaseConnection } from "../database/PgPromiseAdapter";

interface BusinessRepository {
  saveBusiness(
    businessId: string,
    name: string,
    email: string,
    cpf: string,
    password: string,
    city: string,
    district: string,
    addressNumber: number,
    description: string,
    logo: string
  ): Promise<void>;
  getByEmail(email: string): Promise<Business | null>;
  saveService(service: Service): Promise<void>;
  serviceDetail(serviceId: string): Promise<Service>;
  businessDetail(businessId: string): Promise<Business>;
}

class BusinessRepositoryDatabase implements BusinessRepository {

  constructor(readonly connection: DatabaseConnection) { }

  async saveBusiness(
    businessId: string,
    name: string,
    email: string,
    cpf: string,
    password: string,
    city: string,
    district: string,
    addressNumber: number,
    description: string,
    logo: string
  ): Promise<void> {
    await this.connection.query(`INSERT INTO business
    (business_id, name, email, cpf, password, city,
    district, address_number, description, logo) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [
      businessId, name, email, cpf, password,
      city, district, addressNumber, description, logo
    ]);
  }

  async getByEmail(email: string): Promise<Business | null> {
    const [businessData] = await this.connection.query(`SELECT * FROM business 
    WHERE email = $1`, [email]);
    if (businessData) {
      return new Business(businessData.business_id, businessData.name,
        businessData.email, businessData.cpf, businessData.password, businessData.city,
        businessData.district, businessData.address_number,
        businessData.description, businessData.logo);
    }

    return null;
  }

  async saveService(service: Service): Promise<void> {
    await this.connection.query(`INSERT INTO services 
    (service_id, business_id, service_title, price, start_hour) 
    VALUES($1,$2,$3,$4,$5)`, [service.serviceId, service.businessId,
    service.serviceTitle, service.price, service.startHour]);
  }

  async serviceDetail(serviceId: string): Promise<Service> {
    const [serviceData] = await this.connection.query(`SELECT * FROM services 
    WHERE service_id = $1`, [serviceId]);
    return new Service(serviceData.service_id, serviceData.business_id,
      serviceData.service_title, serviceData.price,
    );
  }

  async businessDetail(businessId: string): Promise<Business> {
    const [businessData] = await this.connection.query(`SELECT * FROM business
    WHERE business_id = $1`, [businessId]);

    return new Business(businessData.business_id, businessData.name,
      businessData.email, businessData.password, businessData.city,
      businessData.district, businessData.address_number,
      businessData.description, businessData.logo);
  }

}

export {
  BusinessRepository,
  BusinessRepositoryDatabase
}

