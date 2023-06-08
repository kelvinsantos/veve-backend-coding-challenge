import { Test, TestingModule } from '@nestjs/testing';
import createMockInstance from 'jest-create-mock-instance';

import { NFT } from './nft.entity';
import { NftResolver } from './nft.resolver';
import { NftService } from './nft.service';

const name = 'Mona Lisa';
const blockchainLink = 'https://en.wikipedia.org/wiki/Mona_Lisa';
const description =
  'The Mona Lisa is a half-length portrait painting by Italian artist Leonardo da Vinci.';
const imageUrl =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/270px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg';
const owner = 'Leonardo da Vinci';

describe('NftResolver', () => {
  let resolver: NftResolver;
  let serviceMock: jest.Mocked<NftService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NftResolver],
    })
      .useMocker((token) => {
        if (Object.is(token, NftService)) {
          return createMockInstance(NftService);
        }
      })
      .compile();

    resolver = module.get<NftResolver>(NftResolver);
    serviceMock = module.get<NftService, jest.Mocked<NftService>>(NftService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should add a task and return it', async () => {
    serviceMock.createOne.mockResolvedValueOnce(
      Object.assign(new NFT(), {
        name,
        blockchainLink,
        description,
        imageUrl,
        owner,
      }),
    );

    const task = await resolver.addNft(
      name,
      blockchainLink,
      description,
      imageUrl,
      owner,
    );

    expect(task).toBeInstanceOf(NFT);
    expect(task).toHaveProperty('name', name);
    expect(task).toHaveProperty('blockchainLink', blockchainLink);
    expect(task).toHaveProperty('description', description);
    expect(task).toHaveProperty('imageUrl', imageUrl);
    expect(task).toHaveProperty('owner', owner);
  });

  it('should return all tasks', async () => {
    serviceMock.listAll.mockResolvedValueOnce(
      Array.from({ length: 5 }, () => new NFT()),
    );

    const tasks = await resolver.nfts();

    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks).toHaveLength(5);
  });

  it('should update a task and return it', async () => {
    const id = '548443d7-20fd-4b06-8932-a134fdec798e';
    const changes = { name, blockchainLink, description, imageUrl, owner };
    serviceMock.updateOne.mockResolvedValueOnce(
      Object.assign(new NFT(), { id }, changes),
    );

    const task = await resolver.updateNft(id, changes);

    expect(task).toBeInstanceOf(NFT);
    expect(task).toHaveProperty('name', changes.name);
    expect(task).toHaveProperty('blockchainLink', changes.blockchainLink);
    expect(task).toHaveProperty('description', changes.description);
    expect(task).toHaveProperty('imageUrl', changes.imageUrl);
    expect(task).toHaveProperty('owner', changes.owner);
  });

  it('should delete a task and return it', async () => {
    const id = '548443d7-20fd-4b06-8932-a134fdec798e';
    serviceMock.removeOne.mockResolvedValueOnce(
      Object.assign(new NFT(), { id }),
    );

    const task = await resolver.deleteNft(id);

    expect(task).toBeInstanceOf(NFT);
  });
});
