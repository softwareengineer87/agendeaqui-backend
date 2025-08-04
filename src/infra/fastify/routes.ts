import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { BusinessRepositoryDatabase } from "../repository/BusinessRepository";
import { DatabaseConnection, PgPromiseAdapter } from "../database/PgPromiseAdapter";
import { CreateBusiness } from "../../domain/application/usecases/dashboard/CreateBusiness";
import { Login } from "../../domain/application/usecases/dashboard/Login";
import { CreateService } from "../../domain/application/usecases/dashboard/CreateService";
import { UpdateService } from "../../domain/application/usecases/dashboard/UpdateService";
import { DeleteService } from "../../domain/application/usecases/dashboard/DeleteService";
import { GetAllServicesByBusiness } from "../../domain/application/usecases/dashboard/GetAllServicesByBusiness";
import { ServiceDetail } from "../../domain/application/usecases/dashboard/ServiceDetail";
import { AllServices } from "../../domain/application/usecases/dashboard/AllServices";
import { GetBusiness } from "../../domain/application/usecases/dashboard/GetBusiness";
import { BusinessDetail } from "../../domain/application/usecases/dashboard/BusinessDetail";
import { UpdateBusiness } from "../../domain/application/usecases/dashboard/UpdateBusiness";

function routes(fastify: FastifyInstance, connection: DatabaseConnection) {

  const businessRepository = new BusinessRepositoryDatabase(connection);
  const createBusiness = new CreateBusiness(businessRepository);
  const businessLogin = new Login(businessRepository);
  const createService = new CreateService(businessRepository);
  const updateService = new UpdateService(connection);
  const deleteService = new DeleteService(connection);
  const getServicesByBusinessId = new GetAllServicesByBusiness(connection);
  const serviceDetail = new ServiceDetail(businessRepository);
  const allServices = new AllServices(connection);
  const getBusiness = new GetBusiness(connection);
  const businessDetail = new BusinessDetail(businessRepository);
  const updateBusiness = new UpdateBusiness(connection);

  fastify.get('/', (request: FastifyRequest, reply: FastifyReply) => {
    try {
      reply.code(200).send({ ok: true, test: 'ok' });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.post('/business', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name, email, cpf, password, city, district, address_number,
        description, logo
      } = request.body as {
        name: string,
        email: string,
        cpf: string,
        password: string,
        city: string,
        district: string,
        address_number: number,
        description: string,
        logo: string
      };
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
      }
      const { businessId, token } = await createBusiness.execute(inputBusiness);

      reply.code(200).send({
        businessId,
        token,
        message: 'Empresa cadastrada com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.get('/business', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const business = await getBusiness.execute();
      reply.code(200).send(business);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.get('/business/:business_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { business_id } = request.params as { business_id: string };
      const business = await businessDetail.execute(business_id);
      reply.code(200).send(business);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.put('/business/:business_id', async (request: FastifyRequest, reply: FastifyReply) => {
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
      } = request.body as {
        name: string,
        email: string,
        password: string,
        city: string,
        district: string,
        address_number: number,
        description: string,
        logo: string
      }
      const { business_id } = request.params as { business_id: string };
      const addressNumber = address_number;
      const { businessId } = await updateBusiness.execute(
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
        message: 'Empresa atualizada com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.post('/business/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = request.body as { email: string, password: string };
      const { token, payload } = await businessLogin.execute(email, password);
      reply.code(200).send({
        token,
        payload,
        message: 'Login efetuado com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.post('/business/services/:business_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { service_title, price, start_hour } = request.body as {
        service_title: string, price: number, start_hour: string
      };
      const { business_id } = request.params as { business_id: string };
      const inputService = {
        businessId: business_id,
        serviceTitle: service_title,
        price,
        startHour: start_hour
      }
      const { serviceId } = await createService.execute(inputService);
      reply.code(201).send({
        serviceId,
        message: 'Serviço cadastrado com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.put('/business/services_update/:service_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const {
        service_title,
        price
      } = request.body as {
        service_title: string, description: string, price: number,
        start_hour: string, end_hour: string, service_date: Date
      };
      const { service_id } = request.params as { service_id: string };
      await updateService.execute(
        service_id,
        service_title,
        price
      );
      reply.code(201).send({
        message: 'Serviço atualizado com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.delete('/business/services_delete/:service_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { service_id } = request.params as { service_id: string };
      await deleteService.execute(service_id);
      reply.code(200).send({
        message: 'Serviço deletado com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.get('/business/services/:business_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { business_id } = request.params as { business_id: string };
      const { limit, offset } = request.query as
        { limit: number, offset: number };
      const business = await getServicesByBusinessId.
        execute(business_id, limit, offset);

      reply.code(200).send(business);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.get('/business/service_detail/:service_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { service_id } = request.params as { service_id: string };
      const service = await serviceDetail.execute(service_id);
      reply.code(200).send(service);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.get('/business/all_services/:business_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { business_id } = request.params as { business_id: string };
      const services = await allServices.execute(business_id);
      reply.code(200).send(services);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });
}

export { routes }


