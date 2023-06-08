import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NFT } from './nft.entity';
import { NftResolver } from './nft.resolver';
import { NftService } from './nft.service';

@Module({
  imports: [TypeOrmModule.forFeature([NFT])],
  providers: [NftResolver, NftService],
})
export class NftModule {}
