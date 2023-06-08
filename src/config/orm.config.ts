import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import { CreateNft1686203508386 } from '../migrations/1686203508386-CreateNft';
import { NFT } from '../nft/nft.entity';
import NftFactory from '../nft/nft.factory';
import NftSeeder from '../nft/nft.seeder';

const mainOptions: DataSourceOptions = {
  type: 'mysql',
  url: process.env.DATABASE_URL,
  synchronize: false,
  migrations: [CreateNft1686203508386],
  entities: [NFT],
};

const testOptions: DataSourceOptions & SeederOptions = {
  type: 'sqlite',
  database: ':memory:',
  synchronize: false,
  migrationsRun: true,
  entities: [NFT],
  migrations: [CreateNft1686203508386],
  factories: [NftFactory],
  seeds: [NftSeeder],
};

// used by CLI commands
export const AppDataSource = new DataSource({ ...testOptions, ...mainOptions });

export default registerAs('orm', () =>
  process.env.NODE_ENV === 'test' ? testOptions : mainOptions,
);
