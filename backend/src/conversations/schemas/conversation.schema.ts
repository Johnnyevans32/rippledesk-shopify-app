import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

export enum CallDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

export enum CallStatus {
  ANSWERED = 'answered',
  MISSED = 'missed',
  VOICEMAIL = 'voicemail',
  BUSY = 'busy',
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc: any, ret: any, _options: any): void => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.isDeleted;
    },
  },
  toObject: {
    virtuals: true,
  },
})
export class Conversation {
  @Prop({ required: true })
  shopifyDomain: string;

  @Prop({ required: true })
  callerNumber: string;

  @Prop()
  callerName?: string;

  @Prop({ required: true })
  calleeNumber: string;

  @Prop()
  calleeName?: string;

  @Prop({ required: true, enum: CallDirection })
  direction: CallDirection;

  @Prop({ required: true, enum: CallStatus })
  status: CallStatus;

  @Prop({ required: true })
  startTime: Date;

  @Prop()
  endTime?: Date;

  @Prop()
  duration?: number;

  @Prop()
  recordingUrl?: string;

  @Prop()
  notes?: string;

  @Prop({ type: [String] })
  tags?: string[];

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ type: Types.Map })
  metadata?: Map<string, any>;

  id: string;
  updatedAt: Date;
  createdAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.index({ shopifyDomain: 1, createdAt: -1 });
ConversationSchema.index({ direction: 1, createdAt: -1 });
ConversationSchema.index({ startTime: 1 });
ConversationSchema.index({ callerNumber: 1, calleeNumber: 1 });
