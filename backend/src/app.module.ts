import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { ConversationsModule } from './conversations/conversations.module';
import config from './core/config';
import mongoosePaginate from 'mongoose-paginate-v2';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRoot(config().database.url, {
      connectionFactory(connection) {
        connection.plugin(mongoosePaginate);
        return connection;
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
    }),
    ConversationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
