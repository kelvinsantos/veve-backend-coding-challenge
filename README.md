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

## Questions
```bash
Q: How did you decide on the technical and architectural choices used as part of your solution?

A: I think for technical and architectural I just follwed what is required for this challenge. I did a quick crash course about NestJS, GraphQL and TypeORM. I really find the framework + stack really interesting. Let me break it down.

Note: For NestJS and GraphQL, it is my first time creating a project with those framework.

NestJS: I really like how structured and modular this framwork on building server-side applications. I find it easy to understand, the decorators are helpful for me with this challenge as it makes my life easier on doing the authenticated user stuff. The dependency injection is also a cool thing, when a module is initiated it will automatically create a new instance for the required dependencies so no need to use the 'new' keyword in order to create one. I think at the moment this is my favorite node.js backend framwork. There is still a long way for me to master everything with it, but I'm really interested on knowing everything about it.

GraphQL: This query language thing right here is a stunning! The ability to for the frontend data to be flexible without touching the backend APIs is so cool! If this is paired with TypeORM, everything is much more faster to build. You can create new modules in no time!
```

```bash
Q: Are there any improvements you could make to your submission?

A: There are a lot of things that I think is missing here let me list them down:
  - Testing
    - Code coverage
    - Create a separate end-to-end tests folder
    - Improve unit tests performance
  - User and Authentication
    - At the moment the users are only stored in a cache and they are static so in order to improve I need to fully create a CRUD operations for user and user data must be stored in the database
    - The password of users are in cleartext, as an improvement they should be hash/salted
  - Data Migration
    - Right now the migration is not dynamic, when we add new modules or update something on the existing schema we also need to update the orm.config.ts. I think there should be a way to make it dynamic  
  - Code Comments
    - At the moment I didn't put code comments/documentations, I think this is also one improvement
  - API Documentation
    - At the moment I don't have API documentation, although I have a postman collection
  - Security and Validations
    - There might be more things that I can add here to make the application more secure, like adding cors, helmet, etc.
  - Database
    - There might still some ways to improve db query speed by adding some indexes
```

```bash
Q: What would you do differently if you were allocated more time?

A: If given more time, aside from the things I wrote above. I will create a CI/CD pipeline to build and deploy this into a server.
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

Testing endpoints

```bash
You can use Postman to call the endpoints available for this project. Please refer to 'postman_collections' folder and import the 'collections' and 'environment' to Postman.
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
