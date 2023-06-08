import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createMockInstance } from 'jest-create-mock-instance';

import { NFT } from './nft.entity';
import { NftService } from './nft.service';

const name = 'Mona Lisa';
const blockchainLink = 'https://en.wikipedia.org/wiki/Mona_Lisa';
const description =
  'The Mona Lisa is a half-length portrait painting by Italian artist Leonardo da Vinci.';
const imageUrl =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/270px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg';
const owner = 'Leonardo da Vinci';

describe('NftService', () => {
  let service: NftService;
  let repositoryMock: jest.Mocked<Repository<NFT>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NftService],
    })
      .useMocker((token) => {
        if (token === getRepositoryToken(NFT)) {
          const mock = createMockInstance(Repository);

          mock.save.mockImplementation((entity) => Promise.resolve(entity));
          mock.findOneBy.mockImplementation((where) =>
            Promise.resolve(Object.assign(new NFT(), where)),
          );

          return mock;
        }
      })
      .compile();

    service = module.get<NftService>(NftService);
    repositoryMock = module.get<Repository<NFT>, jest.Mocked<Repository<NFT>>>(
      getRepositoryToken(NFT),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create one nft', async () => {
    repositoryMock.create.mockImplementation((dto) =>
      Object.assign(new NFT(), dto),
    );

    await expect(
      service.createOne(name, blockchainLink, description, imageUrl, owner),
    ).resolves.toBeInstanceOf(NFT);
    expect(repositoryMock.save).toHaveBeenCalled();
  });

  it('should get one nft by id', async () => {
    await expect(
      service.getOne('548443d7-20fd-4b06-8932-a134fdec798e'),
    ).resolves.toBeInstanceOf(NFT);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({
      id: '548443d7-20fd-4b06-8932-a134fdec798e',
    });
  });

  it('should fail to get one nft when not exist', async () => {
    repositoryMock.findOneBy.mockResolvedValueOnce(undefined);

    await expect(
      service.getOne('548443d7-20fd-4b06-8932-a134fdec798e'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should list all nfts', async () => {
    repositoryMock.find.mockResolvedValueOnce(
      Array.from({ length: 5 }, () => new NFT()),
    );

    await expect(service.listAll()).resolves.toMatchObject(
      expect.arrayContaining([expect.any(NFT)]),
    );
    expect(repositoryMock.find).toHaveBeenCalled();
  });

  it('should update one existing nft', async () => {
    repositoryMock.merge.mockImplementation(Object.assign);

    await expect(
      service.updateOne('548443d7-20fd-4b06-8932-a134fdec798e', {
        name,
      }),
    ).resolves.toHaveProperty('name', name);
    expect(repositoryMock.save).toHaveBeenCalled();
  });

  it('should remove one nft', async () => {
    repositoryMock.remove.mockImplementation((entity) =>
      Promise.resolve(entity),
    );

    await expect(
      service.removeOne('548443d7-20fd-4b06-8932-a134fdec798e'),
    ).resolves.toBeInstanceOf(NFT);
    expect(repositoryMock.delete).toHaveBeenCalled();
  });
});
