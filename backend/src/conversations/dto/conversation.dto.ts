import {
  InputType,
  Field,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CallDirection, CallStatus } from '../schemas/conversation.schema';

registerEnumType(CallDirection, {
  name: 'CallDirection',
  description: 'Direction of the call (inbound/outbound)',
});

registerEnumType(CallStatus, {
  name: 'CallStatus',
  description: 'Status of the call',
});

@ObjectType()
export class Conversation {
  @Field()
  id: string;

  @Field()
  shopifyDomain: string;

  @Field()
  callerNumber: string;

  @Field({ nullable: true })
  callerName?: string;

  @Field()
  calleeNumber: string;

  @Field({ nullable: true })
  calleeName?: string;

  @Field(() => CallDirection)
  direction: CallDirection;

  @Field(() => CallStatus)
  status: CallStatus;

  @Field()
  startTime: Date;

  @Field({ nullable: true })
  endTime?: Date;

  @Field({ nullable: true })
  duration?: number;

  @Field({ nullable: true })
  recordingUrl?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field()
  isArchived: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class Metadata {
  @Field()
  totalDocs: number;

  @Field()
  limit: number;

  @Field()
  page?: number;

  @Field()
  totalPages: number;

  @Field(() => Int, { nullable: true })
  prevPage?: number;

  @Field(() => Int, { nullable: true })
  nextPage?: number;
}

@ObjectType()
export class ConversationConnection {
  @Field(() => [Conversation])
  data: Conversation[];

  @Field(() => Metadata)
  metadata: Metadata;
}

@ObjectType()
export class ConversationStats {
  @Field()
  totalCalls: number;

  @Field()
  inboundCalls: number;

  @Field()
  outboundCalls: number;

  @Field()
  missedCalls: number;
}

@InputType()
export class ConversationFilterInput {
  @Field(() => CallDirection, { nullable: true })
  direction?: CallDirection;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  search?: string;

  @Field(() => [CallStatus], { nullable: true })
  statuses?: CallStatus[];

  @Field({ nullable: true })
  callerNumber?: string;

  @Field({ nullable: true })
  calleeNumber?: string;

  @Field({ nullable: true })
  isArchived?: boolean;
}

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit: number;

  @Field({ nullable: true })
  all: boolean;
}

@InputType()
export class CreateConversationInput {
  @Field()
  shopifyDomain: string;

  @Field()
  callerNumber: string;

  @Field({ nullable: true })
  callerName?: string;

  @Field()
  calleeNumber: string;

  @Field({ nullable: true })
  calleeName?: string;

  @Field(() => CallDirection)
  direction: CallDirection;

  @Field(() => CallStatus)
  status: CallStatus;

  @Field()
  startTime: Date;

  @Field({ nullable: true })
  endTime?: Date;

  @Field({ nullable: true })
  duration?: number;

  @Field({ nullable: true })
  recordingUrl?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}

@InputType()
export class UpdateConversationInput {
  @Field({ nullable: true })
  callerName?: string;

  @Field({ nullable: true })
  calleeName?: string;

  @Field(() => CallStatus, { nullable: true })
  status?: CallStatus;

  @Field({ nullable: true })
  endTime?: Date;

  @Field({ nullable: true })
  duration?: number;

  @Field({ nullable: true })
  recordingUrl?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  isArchived?: boolean;
}
