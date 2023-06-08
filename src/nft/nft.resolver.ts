import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';

import { NFT } from './nft.entity';
import { NftService } from './nft.service';
import { Pagination, UpdateNft, UpdateNftOwner } from './update-nft.dto';

import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/auth.guard';

@Resolver(() => NFT)
@UseGuards(JwtAuthGuard)
export class NftResolver {
  constructor(private readonly nftService: NftService) {}

  @Mutation(() => NFT)
  addNft(
    @CurrentUser() user: any,
    @Args('name') name: string,
    @Args('blockchainLink') blockchainLink: string,
    @Args('description') description: string,
    @Args('imageUrl') imageUrl: string,
  ) {
    return this.nftService.createOne(
      name,
      blockchainLink,
      description,
      imageUrl,
      user['username'],
    );
  }

  @Query(() => NFT)
  nft(@Args('id', { type: () => ID }) id: NFT['id']) {
    return this.nftService.getOne(id);
  }

  @Query(() => [NFT])
  nfts() {
    return this.nftService.listAll();
  }

  @Mutation(() => NFT)
  updateNft(
    @Args('id', { type: () => ID }) id: NFT['id'],
    @Args('updateNftInput') changes: UpdateNft,
  ) {
    return this.nftService.updateOne(id, changes);
  }

  @Mutation(() => NFT)
  deleteNft(@Args('id', { type: () => ID }) id: NFT['id']) {
    return this.nftService.removeOne(id);
  }

  @Mutation(() => NFT)
  async changeNftOwner(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: NFT['id'],
    @Args('updateNftOwnerInput') changes: UpdateNftOwner,
  ) {
    const nft = await this.nftService.getOne(id);
    if (nft.owner !== user['username']) {
      throw new UnauthorizedException(
        null,
        'Only the original owner can change the ownership of this NFT',
      );
    }
    return this.nftService.updateOne(id, changes);
  }

  @Query(() => Number, { name: 'count' })
  async getCount(): Promise<number> {
    return this.nftService.countOwnedNft();
  }

  @Query(() => [NFT])
  async listOwnedNft(
    @CurrentUser() user: any,
    @Args('pagination') pagination: Pagination,
  ) {
    return this.nftService.listOwnedNft(
      user['username'],
      pagination.skip,
      pagination.take,
    );
  }
}
