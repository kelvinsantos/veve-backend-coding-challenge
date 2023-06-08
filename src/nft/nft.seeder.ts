import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import type { DataSource } from 'typeorm';

import { NFT } from './nft.entity';

class TaskSeeder implements Seeder {
  async run(
    _dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const taskFactory = factoryManager.get(NFT);
    await taskFactory.saveMany(5);
  }
}

export default TaskSeeder;
