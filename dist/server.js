"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/infra/fastify/server.ts
var import_fastify = __toESM(require("fastify"));
var import_cors = __toESM(require("@fastify/cors"));

// src/domain/entities/Business.ts
var import_uuid = require("uuid");

// src/domain/Password.ts
var import_bcrypt = require("bcrypt");
var Password = class {
  constructor(password) {
    if (password === "") {
      throw new Error("A senha \xE9 obrigat\xF3ria.");
    }
    this.value = password;
  }
  emcryptPassword(plainPassword) {
    return __async(this, null, function* () {
      const salt = 10;
      return yield (0, import_bcrypt.hash)(plainPassword, salt);
    });
  }
  decryptPassword(plainPassword, hashPassword) {
    return __async(this, null, function* () {
      return yield (0, import_bcrypt.compare)(plainPassword, hashPassword);
    });
  }
  getValue() {
    return this.value;
  }
};

// src/domain/entities/Business.ts
var import_jsonwebtoken = require("jsonwebtoken");

// src/domain/Email.ts
var Email = class {
  constructor(email) {
    if (!email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/)) {
      throw new Error("Email inv\xE1lido.");
    }
    if (email === "") {
      throw new Error("O email \xE9 obrigat\xF3rio!");
    }
    this.value = email;
  }
  getValue() {
    return this.value;
  }
};

// src/domain/entities/Business.ts
var Business = class _Business {
  constructor(businessId, name, email, cpf, password, city, district, addressNumber, description, logo) {
    this.businessId = businessId;
    this.name = name;
    this.cpf = cpf;
    this.city = city;
    this.district = district;
    this.addressNumber = addressNumber;
    this.description = description;
    this.logo = logo;
    if (name === "") {
      throw new Error("O nome \xE9 obrigat\xF3rio.");
    }
    if (email === "") {
      throw new Error("O e-mail \xE9 obrigat\xF3rio.");
    }
    if (cpf === "") {
      throw new Error("O cpf \xE9 obrigat\xF3rio.");
    }
    if (password === "") {
      throw new Error("A senha \xE9 obrigat\xF3ria.");
    }
    if (city === "") {
      throw new Error("A cidade \xE9 obrigat\xF3rio.");
    }
    if (district === "") {
      throw new Error("O bairro \xE9 obrigat\xF3rio.");
    }
    if (description === "") {
      throw new Error("A descricao \xE9 obrigat\xF3rio.");
    }
    this.email = new Email(email);
    this.password = new Password(password);
  }
  static create(name, email, cpf, password, city, district, addressNumber, description, logo) {
    const businessId = (0, import_uuid.v4)();
    return new _Business(
      businessId,
      name,
      email,
      cpf,
      password,
      city,
      district,
      addressNumber,
      description,
      logo
    );
  }
  generateToken() {
    const payload = {
      businessId: this.businessId,
      name: this.name,
      email: this.email,
      cpf: this.cpf,
      city: this.city,
      district: this.district,
      addressNumber: this.addressNumber,
      logo: this.logo
    };
    const token = (0, import_jsonwebtoken.sign)(payload, "webdesign", { algorithm: "HS256" });
    return token;
  }
  verifyToken(token) {
    return (0, import_jsonwebtoken.verify)(token, "webdesign");
  }
  validateToken() {
    const token = this.generateToken();
    if (token !== this.verifyToken(token)) {
      throw new Error("Token inv\xE1lido, fa\xE7a login novamente.");
    }
  }
  getEmail() {
    return this.email.getValue();
  }
  getPassword() {
    return this.password.getValue();
  }
};

// src/domain/entities/Service.ts
var import_uuid2 = require("uuid");
var Service = class _Service {
  constructor(serviceId, businessId, serviceTitle, price) {
    this.serviceId = serviceId;
    this.businessId = businessId;
    this.serviceTitle = serviceTitle;
    this.price = price;
    if (serviceTitle === "") {
      throw new Error("O titulo \xE9 obrigat\xF3rio!");
    }
    if (price < 0 || price !== Number(price)) {
      throw new Error("O pre\xE7o precisabser maior que zero e \xE9 origat\xF3rio!");
    }
  }
  static create(businessId, serviceTitle, price) {
    const serviceId = (0, import_uuid2.v4)();
    return new _Service(
      serviceId,
      businessId,
      serviceTitle,
      price
    );
  }
};

// src/infra/repository/BusinessRepository.ts
var BusinessRepositoryDatabase = class {
  constructor(connection2) {
    this.connection = connection2;
  }
  saveBusiness(businessId, name, email, cpf, password, city, district, addressNumber, description, logo) {
    return __async(this, null, function* () {
      yield this.connection.query(`INSERT INTO business
    (business_id, name, email, cpf, password, city,
    district, address_number, description, logo) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [
        businessId,
        name,
        email,
        cpf,
        password,
        city,
        district,
        addressNumber,
        description,
        logo
      ]);
    });
  }
  getByEmail(email) {
    return __async(this, null, function* () {
      const [businessData] = yield this.connection.query(`SELECT * FROM business 
    WHERE email = $1`, [email]);
      if (businessData) {
        return new Business(
          businessData.business_id,
          businessData.name,
          businessData.email,
          businessData.cpf,
          businessData.password,
          businessData.city,
          businessData.district,
          businessData.address_number,
          businessData.description,
          businessData.logo
        );
      }
      return null;
    });
  }
  saveService(service) {
    return __async(this, null, function* () {
      yield this.connection.query(`INSERT INTO services 
    (service_id, business_id, service_title, price) 
    VALUES($1,$2,$3,$4)`, [
        service.serviceId,
        service.businessId,
        service.serviceTitle,
        service.price
      ]);
    });
  }
  serviceDetail(serviceId) {
    return __async(this, null, function* () {
      const [serviceData] = yield this.connection.query(`SELECT * FROM services 
    WHERE service_id = $1`, [serviceId]);
      return new Service(
        serviceData.service_id,
        serviceData.business_id,
        serviceData.service_title,
        serviceData.price
      );
    });
  }
  businessDetail(businessId) {
    return __async(this, null, function* () {
      const [businessData] = yield this.connection.query(`SELECT * FROM business
    WHERE business_id = $1`, [businessId]);
      return new Business(
        businessData.business_id,
        businessData.name,
        businessData.email,
        businessData.password,
        businessData.city,
        businessData.district,
        businessData.address_number,
        businessData.description,
        businessData.logo
      );
    });
  }
};

// src/domain/application/usecases/dashboard/CreateBusiness.ts
var CreateBusiness = class {
  constructor(businessRepository) {
    this.businessRepository = businessRepository;
  }
  execute(input) {
    return __async(this, null, function* () {
      const businessData = yield this.businessRepository.getByEmail(input.email);
      if (businessData) {
        throw new Error("Este email j\xE1 est\xE1 cadastrado no sistema.");
      }
      const business = Business.create(
        input.name,
        input.email,
        input.cpf,
        input.password,
        input.city,
        input.district,
        input.addressNumber,
        input.description,
        input.logo
      );
      const hashPass = yield business.password.emcryptPassword(input.password);
      const token = business.generateToken();
      yield this.businessRepository.saveBusiness(
        business.businessId,
        business.name,
        business.getEmail(),
        business.cpf,
        hashPass,
        business.city,
        business.district,
        business.addressNumber,
        business.description,
        business.logo
      );
      return {
        businessId: business.businessId,
        token
      };
    });
  }
};

// src/domain/application/usecases/dashboard/Login.ts
var Login = class {
  constructor(businessRepository) {
    this.businessRepository = businessRepository;
  }
  execute(email, password) {
    return __async(this, null, function* () {
      const business = yield this.businessRepository.getByEmail(email);
      if (!business) {
        throw new Error("Empresa n\xE3o encontrada, verifique as informa\xE7\xF5es.");
      }
      const mathPassword = yield business.password.decryptPassword(password, business.getPassword());
      if (!mathPassword) {
        throw new Error("Email ou senha inv\xE1lidos, tente novamente.");
      }
      const token = business.generateToken();
      const payload = business.verifyToken(token);
      return {
        token,
        payload
      };
    });
  }
};

// src/domain/application/usecases/dashboard/CreateService.ts
var CreateService = class {
  constructor(businessRepository) {
    this.businessRepository = businessRepository;
  }
  execute(input) {
    return __async(this, null, function* () {
      const service = Service.create(
        input.businessId,
        input.serviceTitle,
        input.price
      );
      yield this.businessRepository.saveService(service);
      return {
        serviceId: service.serviceId
      };
    });
  }
};

// src/domain/application/usecases/dashboard/UpdateService.ts
var UpdateService = class {
  constructor(connection2) {
    this.connection = connection2;
  }
  execute(serviceId, serviceTitle, price) {
    return __async(this, null, function* () {
      yield this.connection.query(`UPDATE services SET 
    service_title = $1, price = $2 
    WHERE service_id = $3`, [
        serviceTitle,
        price,
        serviceId
      ]);
    });
  }
};

// src/domain/application/usecases/dashboard/DeleteService.ts
var DeleteService = class {
  constructor(connection2) {
    this.connection = connection2;
  }
  execute(serviceId) {
    return __async(this, null, function* () {
      yield this.connection.query(`DELETE FROM services
    WHERE service_id = $1`, [serviceId]);
    });
  }
};

// src/domain/application/usecases/dashboard/GetAllServicesByBusiness.ts
var GetAllServicesByBusiness = class {
  constructor(connection2) {
    this.connection = connection2;
  }
  execute(businessId, limit, offset) {
    return __async(this, null, function* () {
      const services = yield this.connection.query(`SELECT s.*, 
    b.name as business_name, b.email 
    FROM services as s
    JOIN business AS b ON s.business_id = b.business_id
    WHERE b.business_id = $1
    LIMIT $2 OFFSET $3`, [businessId, limit, offset]);
      return services;
    });
  }
};

// src/domain/application/usecases/dashboard/ServiceDetail.ts
var ServiceDetail = class {
  constructor(businessRepository) {
    this.businessRepository = businessRepository;
  }
  execute(serviceId) {
    return __async(this, null, function* () {
      const service = yield this.businessRepository.serviceDetail(serviceId);
      if (!service) {
        throw new Error("Servi\xE7o n\xE3o encontrado.");
      }
      return service;
    });
  }
};

// src/domain/application/usecases/dashboard/AllServices.ts
var AllServices = class {
  constructor(connection2) {
    this.connection = connection2;
  }
  execute(businessId) {
    return __async(this, null, function* () {
      const services = yield this.connection.query(`SELECT s.*, 
    b.name as business_name, b.email, b.district, 
    b.description, b.logo 
    FROM services as s
    JOIN business AS b ON s.business_id = b.business_id
    WHERE b.business_id = $1
    `, [businessId]);
      return services;
    });
  }
};

// src/domain/application/usecases/dashboard/GetBusiness.ts
var GetBusiness = class {
  constructor(connection2) {
    this.connection = connection2;
  }
  execute() {
    return __async(this, null, function* () {
      const business = yield this.connection.query(`SELECT * FROM business`, []);
      return business;
    });
  }
};

// src/domain/application/usecases/dashboard/BusinessDetail.ts
var BusinessDetail = class {
  constructor(businessRepository) {
    this.businessRepository = businessRepository;
  }
  execute(businessId) {
    return __async(this, null, function* () {
      const business = yield this.businessRepository.businessDetail(businessId);
      return {
        businessId: business.businessId,
        name: business.name,
        email: business.getEmail(),
        password: business.password.getValue(),
        city: business.city,
        district: business.district,
        addressNumber: business.addressNumber,
        logo: business.logo
      };
    });
  }
};

// src/domain/application/usecases/dashboard/UpdateBusiness.ts
var UpdateBusiness = class {
  constructor(connection2) {
    this.connection = connection2;
  }
  execute(business_id, name, email, password, city, district, addressNumber, description, logo) {
    return __async(this, null, function* () {
      const business = Business.create(
        name,
        email,
        password,
        city,
        district,
        addressNumber,
        description,
        logo
      );
      const hashPass = yield business.password.emcryptPassword(password);
      yield this.connection.query(`UPDATE business SET
    name = $1, email = $2, password = $3, city = $4, district = $5, 
    address_number= $6, description = $7, logo = $8
    WHERE business_id = $9`, [
        business.name,
        business.getEmail(),
        hashPass,
        business.city,
        business.district,
        business.addressNumber,
        business.description,
        business.logo,
        business_id
      ]);
      return {
        businessId: business_id
      };
    });
  }
};

// src/infra/fastify/routes.ts
function routes(fastify, connection2) {
  const businessRepository = new BusinessRepositoryDatabase(connection2);
  const createBusiness = new CreateBusiness(businessRepository);
  const businessLogin = new Login(businessRepository);
  const createService = new CreateService(businessRepository);
  const updateService = new UpdateService(connection2);
  const deleteService = new DeleteService(connection2);
  const getServicesByBusinessId = new GetAllServicesByBusiness(connection2);
  const serviceDetail = new ServiceDetail(businessRepository);
  const allServices = new AllServices(connection2);
  const getBusiness = new GetBusiness(connection2);
  const businessDetail = new BusinessDetail(businessRepository);
  const updateBusiness = new UpdateBusiness(connection2);
  fastify.get("/", (request, reply) => {
    try {
      reply.code(200).send({ ok: true, test: "ok" });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });
  fastify.post("/business", (request, reply) => __async(null, null, function* () {
    try {
      const {
        name,
        email,
        cpf,
        password,
        city,
        district,
        address_number,
        description,
        logo
      } = request.body;
      const inputBusiness = {
        name,
        email,
        cpf,
        password,
        city,
        district,
        addressNumber: address_number,
        description,
        logo
      };
      const { businessId, token } = yield createBusiness.execute(inputBusiness);
      reply.code(200).send({
        businessId,
        token,
        message: "Empresa cadastrada com sucesso!"
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  }));
  fastify.get("/business", (request, reply) => __async(null, null, function* () {
    try {
      const business = yield getBusiness.execute();
      reply.code(200).send(business);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  }));
  fastify.get("/business/:business_id", (request, reply) => __async(null, null, function* () {
    try {
      const { business_id } = request.params;
      const business = yield businessDetail.execute(business_id);
      reply.code(200).send(business);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  }));
  fastify.put("/business/:business_id", (request, reply) => __async(null, null, function* () {
    try {
      const {
        name,
        email,
        password,
        city,
        district,
        address_number,
        description,
        logo
      } = request.body;
      const { business_id } = request.params;
      const addressNumber = address_number;
      const { businessId } = yield updateBusiness.execute(
        business_id,
        name,
        email,
        password,
        city,
        district,
        addressNumber,
        description,
        logo
      );
      reply.code(200).send({
        businessId,
        message: "Empresa atualizada com sucesso!"
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  }));
  fastify.post("/business/login", (request, reply) => __async(null, null, function* () {
    try {
      const { email, password } = request.body;
      const { token, payload } = yield businessLogin.execute(email, password);
      reply.code(200).send({
        token,
        payload,
        message: "Login efetuado com sucesso!"
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  }));
  fastify.post("/business/services/:business_id", (request, reply) => __async(null, null, function* () {
    try {
      const { service_title, price } = request.body;
      const { business_id } = request.params;
      const inputService = {
        businessId: business_id,
        serviceTitle: service_title,
        price
      };
      const { serviceId } = yield createService.execute(inputService);
      reply.code(201).send({
        serviceId,
        message: "Servi\xE7o cadastrado com sucesso!"
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  }));
  fastify.put("/business/services_update/:service_id", (request, reply) => __async(null, null, function* () {
    try {
      const {
        service_title,
        price
      } = request.body;
      const { service_id } = request.params;
      yield updateService.execute(
        service_id,
        service_title,
        price
      );
      reply.code(201).send({
        message: "Servi\xE7o atualizado com sucesso!"
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  }));
  fastify.delete("/business/services_delete/:service_id", (request, reply) => __async(null, null, function* () {
    try {
      const { service_id } = request.params;
      yield deleteService.execute(service_id);
      reply.code(200).send({
        message: "Servi\xE7o deletado com sucesso!"
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  }));
  fastify.get("/business/services/:business_id", (request, reply) => __async(null, null, function* () {
    try {
      const { business_id } = request.params;
      const { limit, offset } = request.query;
      const business = yield getServicesByBusinessId.execute(business_id, limit, offset);
      reply.code(200).send(business);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  }));
  fastify.get("/business/service_detail/:service_id", (request, reply) => __async(null, null, function* () {
    try {
      const { service_id } = request.params;
      const service = yield serviceDetail.execute(service_id);
      reply.code(200).send(service);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  }));
  fastify.get("/business/all_services/:business_id", (request, reply) => __async(null, null, function* () {
    try {
      const { business_id } = request.params;
      const services = yield allServices.execute(business_id);
      reply.code(200).send(services);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  }));
}

// src/infra/database/PgPromiseAdapter.ts
var import_node_path = require("path");
var import_pg_promise = __toESM(require("pg-promise"));
var PgPromiseAdapter = class {
  constructor() {
    this.connection = (0, import_pg_promise.default)()(`postgressql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:5432/${process.env.POSTGRES_DB}`);
  }
  query(statement, params) {
    return __async(this, null, function* () {
      return yield this.connection.query(statement, params);
    });
  }
  executeScript(script) {
    return __async(this, null, function* () {
      const pgPromise = (0, import_pg_promise.default)();
      const filePath = (0, import_node_path.join)(script);
      const query = new pgPromise.QueryFile(filePath);
      return yield this.connection.query(query);
    });
  }
  close() {
    return __async(this, null, function* () {
      return yield this.connection.$pool.end();
    });
  }
};

// src/domain/application/usecases/customer/Login.ts
var Login2 = class {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }
  execute(email, password) {
    return __async(this, null, function* () {
      const customer = yield this.customerRepository.getByEmail(email);
      if (!customer) {
        throw new Error("Cliente n\xE3o encontrado, verifique as informa\xE7\xF5es.");
      }
      const mathPassword = yield customer.password.decryptPassword(password, customer.getPassword());
      if (!mathPassword) {
        throw new Error("Email ou senha inv\xE1lidos, tente novamente.");
      }
      const token = customer.generateToken();
      const payload = customer.verifyToken(token);
      return {
        token,
        payload
      };
    });
  }
};

// src/domain/entities/Customer.ts
var import_uuid3 = require("uuid");
var import_jsonwebtoken2 = require("jsonwebtoken");
var Customer = class _Customer {
  constructor(customerId, name, email, password, phone) {
    this.customerId = customerId;
    this.name = name;
    this.phone = phone;
    if (name === "") {
      throw new Error("O nome \xE9 obrigat\xF3rio.");
    }
    if (phone === "") {
      throw new Error("O telefone \xE9 obrigat\xF3rio.");
    }
    this.email = new Email(email);
    this.password = new Password(password);
  }
  static create(name, email, password, phone) {
    const businessId = (0, import_uuid3.v4)();
    return new _Customer(
      businessId,
      name,
      email,
      password,
      phone
    );
  }
  generateToken() {
    const payload = {
      customerId: this.customerId,
      name: this.name,
      email: this.email.getValue(),
      phone: this.phone
    };
    const token = (0, import_jsonwebtoken2.sign)(payload, "webdesign", { algorithm: "HS256" });
    return token;
  }
  verifyToken(token) {
    return (0, import_jsonwebtoken2.verify)(token, "webdesign");
  }
  getEmail() {
    return this.email.getValue();
  }
  getPassword() {
    return this.password.getValue();
  }
};

// src/domain/entities/Schedule.ts
var import_uuid4 = require("uuid");
var Schedule = class _Schedule {
  constructor(scheduleId, serviceId, customerId, businessId, scheduleHour, scheduleDate, status) {
    this.scheduleId = scheduleId;
    this.serviceId = serviceId;
    this.customerId = customerId;
    this.businessId = businessId;
    this.scheduleHour = scheduleHour;
    this.scheduleDate = scheduleDate;
    this.status = status;
  }
  static create(serviceId, customerId, businessId, scheduleHour, scheduleDate) {
    const scheduleId = (0, import_uuid4.v4)();
    const status = "active";
    return new _Schedule(
      scheduleId,
      serviceId,
      customerId,
      businessId,
      scheduleHour,
      scheduleDate,
      status
    );
  }
  cancell() {
    if (this.getStatus() === "inactive") {
      throw new Error("O status j\xE1 est\xE1 cancelado");
    }
    this.status = "inactive";
  }
  getStatus() {
    return this.status;
  }
};

// src/infra/repository/CustomerRepository.ts
var CustomerRepositoryDatabase = class {
  constructor(connection2) {
    this.connection = connection2;
  }
  saveCustomer(customerId, name, email, password, phone) {
    return __async(this, null, function* () {
      yield this.connection.query(`INSERT INTO customers
    (customer_id, name, email, password, phone)
    VALUES($1,$2,$3,$4,$5)`, [
        customerId,
        name,
        email,
        password,
        phone
      ]);
    });
  }
  getByEmail(email) {
    return __async(this, null, function* () {
      const [customerData] = yield this.connection.query(`SELECT * FROM customers 
    WHERE email = $1`, [email]);
      if (customerData) {
        return new Customer(
          customerData.customer_id,
          customerData.name,
          customerData.email,
          customerData.password,
          customerData.phone
        );
      }
      return null;
    });
  }
  saveSchedule(schedule) {
    return __async(this, null, function* () {
      yield this.connection.query(`INSERT INTO schedules
    (schedule_id, service_id, customer_id, business_id, 
    status, schedule_hour, schedule_date)
    VALUES($1,$2,$3,$4,$5,$6,$7)`, [
        schedule.scheduleId,
        schedule.serviceId,
        schedule.customerId,
        schedule.businessId,
        schedule.getStatus(),
        schedule.scheduleHour,
        schedule.scheduleDate
      ]);
    });
  }
  scheduleDetail(scheduleId) {
    return __async(this, null, function* () {
      const [scheduleData] = yield this.connection.query(`SELECT * FROM schedules
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
    });
  }
};

// src/domain/application/usecases/customer/Signup.ts
var Signup = class {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }
  execute(input) {
    return __async(this, null, function* () {
      const customerData = yield this.customerRepository.getByEmail(input.email);
      if (customerData) {
        throw new Error("Este email j\xE1 est\xE1 cadastrado no sistema, tente outro.");
      }
      const customer = Customer.create(
        input.name,
        input.email,
        input.password,
        input.phone
      );
      const hashPass = yield customer.password.emcryptPassword(input.password);
      const token = customer.generateToken();
      yield this.customerRepository.saveCustomer(
        customer.customerId,
        customer.name,
        customer.getEmail(),
        hashPass,
        customer.phone
      );
      return {
        customerId: customer.customerId,
        token
      };
    });
  }
};

// src/domain/application/usecases/customer/CreateSchedule.ts
var CreateSchedule = class {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }
  execute(input) {
    return __async(this, null, function* () {
      const schedule = Schedule.create(
        input.serviceId,
        input.customerId,
        input.businessId,
        input.scheduleHour,
        input.scheduleDate
      );
      yield this.customerRepository.saveSchedule(schedule);
      return {
        scheduleId: schedule.scheduleId
      };
    });
  }
};

// src/middlewares/customerMiddleware.ts
var import_jsonwebtoken3 = __toESM(require("jsonwebtoken"));
function customerMiddleware(request, reply, next) {
  const bearerToken = request.headers.authorization;
  const token = bearerToken == null ? void 0 : bearerToken.split(" ")[1];
  if (!token) {
    throw new Error("Voc\xEA precisa estar logado para ter acesso as funcionalidades.");
  }
  next();
}

// src/domain/application/usecases/customer/GetSchedulesByCustomerId.ts
var GetSchedulesByCustomerId = class {
  constructor(connection2) {
    this.connection = connection2;
  }
  execute(customerId) {
    return __async(this, null, function* () {
      const schedules = this.connection.query(`SELECT * FROM schedules
    WHERE customer_id = $1`, customerId);
      return schedules;
    });
  }
};

// src/domain/application/usecases/customer/ScheduleDetail.ts
var ScheduleDetail = class {
  constructor(connection2) {
    this.connection = connection2;
  }
  execute(scheduleId) {
    return __async(this, null, function* () {
      const [scheduleData] = yield this.connection.query(`
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
    });
  }
};

// src/infra/fastify/routesCustomer.ts
function routesCustomer(fastify, connection2) {
  const customerRepository = new CustomerRepositoryDatabase(connection2);
  const login = new Login2(customerRepository);
  const signup = new Signup(customerRepository);
  const createSchedule = new CreateSchedule(customerRepository);
  const getSchedules = new GetSchedulesByCustomerId(connection2);
  const scheduleDetail = new ScheduleDetail(connection2);
  fastify.post("/customer/login", (request, reply) => __async(null, null, function* () {
    try {
      const { email, password } = request.body;
      const { token, payload } = yield login.execute(email, password);
      reply.code(200).send({
        token,
        payload,
        message: "Login efetuado com sucesso!"
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  }));
  fastify.post("/customer/signup", (request, reply) => __async(null, null, function* () {
    try {
      const {
        name,
        email,
        password,
        phone
      } = request.body;
      const inputSignup = {
        name,
        email,
        password,
        phone
      };
      const { customerId, token } = yield signup.execute(inputSignup);
      reply.code(201).send({
        customerId,
        token,
        message: "Cliente cadastrado com sucesso!"
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  }));
  fastify.post("/customer/create_schedule", { preHandler: customerMiddleware }, (request, reply) => __async(null, null, function* () {
    try {
      const {
        service_id,
        customer_id,
        business_id,
        schedule_hour,
        schedule_date
      } = request.body;
      const inputSchedule = {
        serviceId: service_id,
        customerId: customer_id,
        businessId: business_id,
        scheduleHour: schedule_hour,
        scheduleDate: schedule_date
      };
      const { scheduleId } = yield createSchedule.execute(inputSchedule);
      reply.code(201).send({
        scheduleId,
        message: "Agendamento feito com sucesso!"
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  }));
  fastify.get("/customer/schedules/:customer_id", { preHandler: customerMiddleware }, (request, reply) => __async(null, null, function* () {
    try {
      const { customer_id } = request.params;
      const schedules = yield getSchedules.execute(customer_id);
      reply.code(200).send(schedules);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  }));
  fastify.get("/customer/schedule_detail/:schedule_id", { preHandler: customerMiddleware }, (request, reply) => __async(null, null, function* () {
    try {
      const { schedule_id } = request.params;
      const schedule = yield scheduleDetail.execute(schedule_id);
      reply.code(200).send(schedule);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  }));
  fastify.delete("/customer/:customer_id", (request, reply) => __async(null, null, function* () {
    try {
      const { service_id } = request.params;
      reply.code(200).send({
        message: "Servi\xE7o deletado com sucesso!"
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  }));
}

// src/infra/fastify/server.ts
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var app = (0, import_fastify.default)();
app.register(import_cors.default, {
  origin: "*",
  methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"]
});
var connection = new PgPromiseAdapter();
app.register(routes, connection);
app.register(routesCustomer, connection);
app.listen({ port: Number(process.env.PORT) || 3333 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`server running on http://localhost/${process.env.PORT}`);
});
