import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { DatabaseConnection } from "../database/PgPromiseAdapter";
import { Login } from "../../domain/application/usecases/customer/Login";
import { CustomerRepositoryDatabase } from "../repository/CustomerRepository";
import { Signup } from "../../domain/application/usecases/customer/Signup";
import { CreateSchedule } from "../../domain/application/usecases/customer/CreateSchedule";
import { customerMiddleware } from "../../middlewares/customerMiddleware";
import { GetSchedulesByCustomerId } from "../../domain/application/usecases/customer/GetSchedulesByCustomerId";
import { ScheduleDetail } from "../../domain/application/usecases/customer/ScheduleDetail";
import { DeleteSchedule } from "../../domain/application/usecases/customer/DeleteSchedule";

function routesCustomer(fastify: FastifyInstance, connection: DatabaseConnection) {

  const customerRepository = new CustomerRepositoryDatabase(connection);
  const login = new Login(customerRepository);
  const signup = new Signup(customerRepository);
  const createSchedule = new CreateSchedule(customerRepository);
  const getSchedules = new GetSchedulesByCustomerId(connection);
  const scheduleDetail = new ScheduleDetail(connection);
  const deleteSchedule = new DeleteSchedule(customerRepository);

  fastify.delete('/customer/cancell-schedule/:schedule_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { schedule_id } = request.params as { schedule_id: string };
      const { scheduleId } = await deleteSchedule.execute(schedule_id);
      reply.code(201).send({
        scheduleId,
        message: 'Agendamento cancelado com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.post('/customer/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = request.body as { email: string, password: string };
      const { token, payload } = await login.execute(email, password);
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

  fastify.post('/customer/signup', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const {
        name,
        email,
        password,
        phone,
      } = request.body as {
        name: string, email: string, password: string,
        phone: string
      };
      const inputSignup = {
        name,
        email,
        password,
        phone
      }
      const { customerId, token } = await signup.execute(inputSignup);
      reply.code(201).send({
        customerId,
        token,
        message: 'Cliente cadastrado com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.post('/customer/create_schedule', { preHandler: customerMiddleware }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const {
        service_id,
        customer_id,
        business_id,
        schedule_hour,
        schedule_date
      } = request.body as {
        service_id: string, customer_id: string, business_id: string,
        schedule_hour: string, schedule_date: Date
      };
      const inputSchedule = {
        serviceId: service_id,
        customerId: customer_id,
        businessId: business_id,
        scheduleHour: schedule_hour,
        scheduleDate: schedule_date
      }
      const { scheduleId } = await createSchedule.execute(inputSchedule);
      reply.code(201).send({
        scheduleId,
        message: 'Agendamento feito com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.get('/customer/schedules/:customer_id', { preHandler: customerMiddleware }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { customer_id } = request.params as { customer_id: string };
      const schedules = await getSchedules.execute(customer_id);
      reply.code(200).send(schedules);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.get('/customer/schedule_detail/:schedule_id', { preHandler: customerMiddleware }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { schedule_id } = request.params as { schedule_id: string };
      const schedule = await scheduleDetail.execute(schedule_id);
      reply.code(200).send(schedule);
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });

  fastify.delete('/customer/:customer_id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { service_id } = request.params as { service_id: string };
      reply.code(200).send({
        message: 'Serviço deletado com sucesso!'
      });
    } catch (error) {
      console.log(`Erro no servidor: ${error}`);
      reply.code(500).send(error);
    }
  });


}

export { routesCustomer }


