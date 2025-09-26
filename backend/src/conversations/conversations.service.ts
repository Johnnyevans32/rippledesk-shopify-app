import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';
import {
  ConversationConnection,
  ConversationFilterInput,
  PaginationInput,
  CreateConversationInput,
  UpdateConversationInput,
} from './dto/conversation.dto';
import { CONVERSATION } from '../core/schema.constants';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(CONVERSATION)
    private conversationModel: mongoose.PaginateModel<ConversationDocument>,
  ) {}

  async findAll(
    shopifyDomain: string,
    pagination?: PaginationInput,
    filters?: ConversationFilterInput,
  ): Promise<ConversationConnection> {
    const { page = 1, limit = 10, all } = pagination || {};

    const query: mongoose.FilterQuery<ConversationDocument> = { shopifyDomain };

    if (filters) {
      if (filters.direction) {
        query.direction = filters.direction;
      }

      if (filters.startDate || filters.endDate) {
        query.startTime = {};
        if (filters.startDate) {
          query.startTime.$gte = filters.startDate;
        }
        if (filters.endDate) {
          query.startTime.$lte = filters.endDate;
        }
      }

      if (filters.statuses && filters.statuses.length > 0) {
        query.status = { $in: filters.statuses };
      }

      if (filters.callerNumber) {
        query.callerNumber = { $regex: filters.callerNumber, $options: 'i' };
      }

      if (filters.calleeNumber) {
        query.calleeNumber = { $regex: filters.calleeNumber, $options: 'i' };
      }

      if (filters.search) {
        query.$or = [
          { callerNumber: { $regex: filters.search, $options: 'i' } },
          { calleeNumber: { $regex: filters.search, $options: 'i' } },
          { callerName: { $regex: filters.search, $options: 'i' } },
          { calleeName: { $regex: filters.search, $options: 'i' } },
          { notes: { $regex: filters.search, $options: 'i' } },
        ];
      }

      if (filters.isArchived !== undefined) {
        query.isArchived = filters.isArchived;
      }
    }

    const {
      docs: conversations,
      totalDocs,
      totalPages,
      prevPage,
      nextPage,
    } = await this.conversationModel.paginate(query, {
      sort: { createdAt: -1 },
      page,
      limit,
      pagination: !all,
    });

    return {
      data: conversations,
      metadata: {
        totalDocs,
        totalPages,
        limit,
        page,
        prevPage: prevPage ?? undefined,
        nextPage: nextPage ?? undefined,
      },
    };
  }

  async findOne(id: string, shopifyDomain: string): Promise<Conversation> {
    const conversation = await this.conversationModel
      .findOne({ _id: id, shopifyDomain })
      .exec();
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    return conversation;
  }

  async create(input: CreateConversationInput): Promise<Conversation> {
    const conversation = new this.conversationModel(input);
    return conversation.save();
  }

  async update(
    id: string,
    shopifyDomain: string,
    input: UpdateConversationInput,
  ): Promise<Conversation> {
    const conversation = await this.conversationModel
      .findOneAndUpdate(
        { _id: id, shopifyDomain },
        { $set: input },
        { new: true },
      )
      .exec();

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return conversation;
  }

  async remove(id: string, shopifyDomain: string): Promise<boolean> {
    const result = await this.conversationModel
      .deleteOne({ _id: id, shopifyDomain })
      .exec();
    return result.deletedCount > 0;
  }

  async getStats(shopifyDomain: string) {
    const [totalCalls, inboundCalls, outboundCalls, missedCalls] =
      await Promise.all([
        this.conversationModel.countDocuments({
          shopifyDomain,
        }),
        this.conversationModel.countDocuments({
          shopifyDomain,
          direction: 'inbound',
        }),
        this.conversationModel.countDocuments({
          shopifyDomain,
          direction: 'outbound',
        }),
        this.conversationModel.countDocuments({
          shopifyDomain,
          status: 'missed',
        }),
      ]);

    return {
      totalCalls,
      inboundCalls,
      outboundCalls,
      missedCalls,
    };
  }
}
