import { Field, InputType } from '@nestjs/graphql';

@InputType('UpdateNftInput')
export class UpdateNft {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  blockchainLink?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  owner?: string;
}

@InputType('UpdateNftOwnerInput')
export class UpdateNftOwner {
  @Field({ nullable: true })
  owner?: string;
}

@InputType('PaginationInput')
export class Pagination {
  @Field({ nullable: true })
  skip?: number;

  @Field({ nullable: true })
  take?: number;
}
