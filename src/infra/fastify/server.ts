import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import { routes } from './routes';
import { PgPromiseAdapter } from '../database/PgPromiseAdapter';
import { routesCustomer } from './routesCustomer';
import dotenv from 'dotenv';

dotenv.config();

const app = Fastify();
const port = process.env.PORT || 3333;

app.register(cors, {
  origin: '*',
  methods: ['PUT', 'GET', 'POST', 'DELETE', 'OPTIONS']
});

const connection = new PgPromiseAdapter();
app.register(routes, connection);
app.register(routesCustomer, connection);

//pgPromiseAdapter.executeScript('../database/create.sql');
app.listen({
  port,
  host: '0.0.0.0'
},
  (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(`server running on http://localhost/3333`);
  });

