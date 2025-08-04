DROP TABLE IF EXISTS barbershops, customers, services, schedules CASCADE

CREATE TABLE IF NOT EXISTS business (
  business_id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  cpf TEXT,
  password TEXT,
  city TEXT,
  district TEXT,
  address_number INT,
  description TEXT,
  logo TEXT
);

CREATE TABLE IF NOT EXISTS customers (
  customer_id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  password TEXT,
  phone TEXT
);

CREATE TABLE IF NOT EXISTS services (
  service_id TEXT PRIMARY KEY,
  business_id TEXT,
  service_title TEXT,
  price NUMERIC,
  start_hour TEXT,
  
  CONSTRAINT fk_business FOREIGN KEY(business_id) REFERENCES business(business_id)  
);

CREATE TABLE IF NOT EXISTS schedules (
  schedule_id TEXT PRIMARY KEY,
  service_id TEXT,
  customer_id TEXT,
  business_id TEXT,
  status TEXT,
  schedule_hour TEXT,
  schedule_date DATE,

  CONSTRAINT fk_services FOREIGN KEY(service_id) REFERENCES services(service_id),
  CONSTRAINT fk_customers FOREIGN KEY(customer_id) REFERENCES customers(customer_id),
  CONSTRAINT fk_business FOREIGN KEY(business_id) REFERENCES business(business_id)
);


