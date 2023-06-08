import { setSeederFactory } from 'typeorm-extension';
import { NFT } from './nft.entity';

export default setSeederFactory(NFT, (faker) =>
  Object.assign(new NFT(), {
    id: `"${faker.datatype.uuid}"`,
    name: `"${faker.hacker.noun}"`,
    blockchainLink: `"${faker.internet.url}"`,
    description: `"${faker.hacker.phrase}"`,
    imageUrl: `"${faker.hacker.noun}"`,
    owner: 'john',
  }),
);
