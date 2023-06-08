# Veve Backend Coding Challenge

## Requirements
```bash
[x] The Application should run a GraphQL Server
[x] Use MySql with TypeORM for database
[x] Add a module named `nft` with the following properties (id, name, blockchainLink, description, imageUrl, owner, mintDate)
    [x] Expose the following fields to the client (name, blockchainLink, description, imageUrl, mintDate)
[x] Add User authentication using JWT token with Role Based Access Control
[x] Add a mutation to transfer the NFT to another user
[x] Add a query to fetch user's owned NFTs with pagination
[x] Add unit tests where applicable
```

## Pre-requisite
-   Install Docker and Docker Compose
    -   https://docs.docker.com/desktop/install/mac-install/
-   Install NPM/Node
    -   It's recommended to use nvm so switching node versions can be easily attained (https://github.com/nvm-sh/nvm)
    -   Or you can also install using the default installation of node (https://nodejs.org/en/download/)
-   PNPM
    -   https://pnpm.io/installation

## Features

- GraphQL server with [Apollo](https://www.apollographql.com/)
- [Code first](https://docs.nestjs.com/graphql/quick-start#code-first) approach to build the schema
- [TypeORM](https://typeorm.io/) to connect with MySQL
- Unit tests and E2E tests
- [PNPM](https://pnpm.io/) for a fast and efficient installation
- Check code quality with [MegaLinter](https://megalinter.github.io/latest/)
- Run the necessary services with [docker compose](https://docs.docker.com/compose/)

## Tooling (optional)

```bash
# vscode extensions
- ESLint
- GitLens - Git supercharged
- Prettier - Code formatter
- vscode-icons
- YAML
```

## Run Locally

Clone the project

```bash
  $ git clone https://github.com/kelvinsantos/veve-backend-coding-challenge.git
```

Go to the project directory

```bash
  $ cd veve-backend-coding-challenge
```

Install dependencies

```bash
  $ pnpm install
```

Create a `.env` from the example one and customize it with your [environment variables](#environment-variables)

```bash
  $ cp .env.example .env
```

Start the services using Docker Compose

```bash
  $ docker-compose up -d
```

Run migrations to create the DB schema

```bash
  $ pnpm typeorm migration:run
```

Start the server

```bash
  $ pnpm start:dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MYSQL_DATABASE` the name of the database to connect in the MySQL instance **(required)**

`MYSQL_ROOT_PASSWORD` the password of the _root_ user to connect to the MySQL instance **(required)**

`DATABASE_URL` a connection string to the MySQL instance, example _mysql://root:password@localhost:3306/veve_ **(required)**

`AUTH_EXPIRES_IN` the authentication validity time after logging in

You can copy the example `.env` and edit the values

```bash
  cp .env.example .env
```

## Running Tests

To run unit tests, run the following command:

```bash
  pnpm test
```

To run e2e tests (the MySQL instance must be available), run the following command:

```bash
  pnpm test:e2e
```

## Tech Stack

**Server:** Typescript, MySQL, Nest.js, TypeORM, Apollo

**Test:** Jest, SuperTest

**DevOps:** Docker Compose

## Author

👤 **Kelvin John Santos**

- Twitter: [@kjmsantos](https://twitter.com/kjmsantos)
- Github: [@kelvinsantos](https://github.com/kelvinsantos)
- LinkedIn: [@kjmsantos](https://linkedin.com/in/kelvinsantos)
