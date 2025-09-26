import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationsService } from './conversations.service';
import { ConversationsResolver } from './conversations.resolver';
import { ConversationSchema } from './schemas/conversation.schema';
import { CONVERSATION } from '../core/schema.constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CONVERSATION, schema: ConversationSchema },
    ]),
  ],
  providers: [ConversationsService, ConversationsResolver],
  exports: [ConversationsService],
})
export class ConversationsModule {}
