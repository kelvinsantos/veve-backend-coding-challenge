import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNft1686203508386 implements MigrationInterface {
  name = 'CreateNft1686203508386';
  #tableName = 'nft';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const todoTable = new Table({
      name: this.#tableName,
      columns: [
        {
          name: 'id',
          type: 'varchar',
          isPrimary: true,
          generationStrategy: 'uuid',
        },
        {
          name: 'name',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'blockchainLink',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'description',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'imageUrl',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'owner',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'mintDate',
          type: 'datetime',
          isNullable: false,
          default: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'createdAt',
          type: 'datetime',
          isNullable: false,
          default: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'updatedAt',
          type: 'datetime',
          isNullable: false,
          default: 'CURRENT_TIMESTAMP',
          onUpdate: 'CURRENT_TIMESTAMP',
        },
      ],
    });

    await queryRunner.createTable(todoTable, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.#tableName);
  }
}
