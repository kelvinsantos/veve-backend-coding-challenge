import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NFT } from './nft.entity';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(NFT)
    private readonly nftRepository: Repository<NFT>,
  ) {}

  createOne(
    name: string,
    blockchainLink: string,
    description: string,
    imageUrl: string,
    owner: string,
  ) {
    const nft = this.nftRepository.create({
      name,
      blockchainLink,
      description,
      imageUrl,
      owner,
    });

    return this.nftRepository.save(nft);
  }

  async getOne(id: NFT['id']) {
    const nft = await this.nftRepository.findOneBy({ id });

    if (!nft) throw new NotFoundException('NFT not exist');

    return nft;
  }

  listAll() {
    return this.nftRepository.find();
  }

  async updateOne(
    id: NFT['id'],
    changes: Partial<
      Pick<
        NFT,
        'name' | 'blockchainLink' | 'description' | 'imageUrl' | 'owner'
      >
    >,
  ) {
    const nft = await this.getOne(id);

    this.nftRepository.merge(nft, changes);

    return this.nftRepository.save(nft);
  }

  async removeOne(id: NFT['id']) {
    const nft = await this.getOne(id);

    await this.nftRepository.delete({ id });

    return nft;
  }

  countOwnedNft(owner?: NFT['owner']) {
    return this.nftRepository.count({
      where: {
        owner: owner,
      },
    });
  }

  listOwnedNft(owner?: NFT['owner'], skip = 0, take = 5) {
    return this.nftRepository.find({
      where: {
        owner: owner,
      },
      skip,
      take,
    });
  }
}
