import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

function validateToken(token: string, secretKey: string) {
  const isValid = jwt.decode(token);
}

function customerMiddleware(request: FastifyRequest, reply: FastifyReply, next: any) {
  const bearerToken = request.headers.authorization;
  const token = bearerToken?.split(' ')[1];

  if (!token) {
    throw new Error('Você precisa estar logado para ter acesso as funcionalidades.');
  }

  next();
}

export { customerMiddleware }

