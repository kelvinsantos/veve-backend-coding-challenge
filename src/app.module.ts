import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import loadORM from './config/orm.config';
import { NftModule } from './nft/nft.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
      load: [loadORM],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return config.getOrThrow('orm');
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
    }),
    AuthModule,
    NftModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
