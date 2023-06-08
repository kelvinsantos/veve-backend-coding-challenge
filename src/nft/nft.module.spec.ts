import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

import loadTypeOrmOptions from '../config/orm.config';
import { NFT } from './nft.entity';
import { NftService } from './nft.service';
import { NftModule } from './nft.module';

import { AuthService } from '../auth/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { AuthController } from '../auth/auth.controller';
import { AuthModule } from '../auth/auth.module';

const uuidRegex = /[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}/;
const isoDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;

const name = 'Mona Lisa';
const blockchainLink = 'https://en.wikipedia.org/wiki/Mona_Lisa';
const description =
  'The Mona Lisa is a half-length portrait painting by Italian artist Leonardo da Vinci.';
const imageUrl =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/270px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg';
const owner = 'john';

describe('NftModule integration test', () => {
  let app: INestApplication;
  let nft: NFT;
  const graphqlEndpoint = '/graphql';

  let accessToken: string;

  let controller: AuthController;

  beforeAll(async () => {
    try {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          UsersModule,
          JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: process.env.AUTH_EXPIRES_IN },
          }),
        ],
        providers: [AuthService],
        controllers: [AuthController],
        exports: [AuthService],
      }).compile();

      controller = module.get<AuthController>(AuthController);

      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          TypeOrmModule.forRoot(loadTypeOrmOptions()),
          GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
          }),
          AuthModule,
          NftModule,
        ],
      }).compile();

      app = moduleFixture.createNestApplication();
      const dataSource = app.get<DataSource>(getDataSourceToken());
      await runSeeders(dataSource);

      await app.init();
      nft = await app
        .get(NftService)
        .createOne(name, blockchainLink, description, imageUrl, owner);

      const signIn = await controller.signIn({
        username: 'john',
        password: 'changeme',
      });
      accessToken = signIn.access_token;
    } catch (e) {
      console.log('e::', e);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('should add a nft', async () => {
    const addNft = /* gql */ `mutation addNft($name: String!, $blockchainLink: String!, $description: String!, $imageUrl: String!) {
      addNft(name: $name, blockchainLink: $blockchainLink, description: $description, imageUrl: $imageUrl) {
        id,
        name,
        blockchainLink,
        description,
        imageUrl,
        owner,
        createdAt,
        updatedAt
      }
    }`;

    await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .set('accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: addNft,
        variables: { name, blockchainLink, description, imageUrl },
      })
      .expect(HttpStatus.OK)
      .expect('content-type', /application\/json/)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          data: {
            addNft: {
              id: expect.stringMatching(uuidRegex),
              name,
              blockchainLink,
              description,
              imageUrl,
              owner,
              createdAt: expect.stringMatching(isoDateRegex),
              updatedAt: expect.stringMatching(isoDateRegex),
            },
          },
        });
      });
  });

  it('should return all nfts', async () => {
    const listAll = /* gql */ `query ListAll {
      nfts {
        id,
        name,
        blockchainLink,
        description,
        imageUrl,
        owner,
        createdAt,
        updatedAt
      }
    }`;

    await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .set('accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: listAll,
      })
      .expect(HttpStatus.OK)
      .expect('content-type', /application\/json/)
      .expect(({ body }) => {
        const { nfts } = body.data;

        expect(Array.isArray(nfts)).toBe(true);
        expect(nfts.length).toBeGreaterThanOrEqual(0);
      });
  });

  it('should update a nft', async () => {
    const changes = {
      name,
      blockchainLink,
      description,
      imageUrl,
      owner,
    };
    const updateNft = /* gql */ `mutation UpdateNft($id: ID!, $updateNftInput: UpdateNftInput!) {
      updateNft(id: $id, updateNftInput: $updateNftInput) {
        id,
        name,
        blockchainLink,
        description,
        imageUrl,
        owner,
        createdAt,
        updatedAt
      }
    }`;

    await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .set('accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: updateNft,
        variables: {
          id: nft.id,
          updateNftInput: changes,
        },
      })
      .expect(HttpStatus.OK)
      .expect('content-type', /application\/json/)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          data: {
            updateNft: {
              id: nft.id,
              name: changes.name,
              blockchainLink: changes.blockchainLink,
              description: changes.description,
              imageUrl: changes.imageUrl,
              owner: changes.owner,
              createdAt: expect.stringMatching(isoDateRegex),
              updatedAt: expect.stringMatching(isoDateRegex),
            },
          },
        });
      });
  });

  it('should delete a nft', async () => {
    const deleteNft = /* gql */ `mutation DeleteNft($id: ID!) {
      deleteNft(id: $id) {
        id,
        name,
        blockchainLink,
        description,
        imageUrl,
        owner,
        createdAt,
        updatedAt
      }
    }`;

    await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .set('accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: deleteNft,
        variables: {
          id: nft.id,
        },
      })
      .expect(HttpStatus.OK)
      .expect('content-type', /application\/json/)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          data: {
            deleteNft: {
              id: nft.id,
              name: expect.any(String),
              blockchainLink: expect.any(String),
              description: expect.any(String),
              imageUrl: expect.any(String),
              owner: expect.any(String),
              createdAt: expect.stringMatching(isoDateRegex),
              updatedAt: expect.stringMatching(isoDateRegex),
            },
          },
        });
      });
  });
});
