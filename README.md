<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Cliente Gateway

### Description

The gateway is the communication point between our customers and our services. It is in charge of receiving requests, sending them to the corresponding services and returning the response to the client.

## Dev

1. Clone the repository
2. Install dependencies
3. Create an `.env` based on the `.env.template`
4. To have the microservices that are going to be consumed up.
5. Raise NATS server

```
docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats
```

6. Levantar proyecto con `npm run start:dev`

## Nats

## Installation Prod

1. Clone the repository
2. Create an `.env` based on the `.env.template`
3. Execute command `docker build -f dockerfile.prod -t "name" .`

## Stay in touch

- LinkedIn - [Catriel Escobar](https://www.linkedin.com/in/catrielescobar/)
