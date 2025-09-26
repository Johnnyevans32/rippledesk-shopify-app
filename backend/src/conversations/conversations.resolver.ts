import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ConversationsService } from './conversations.service';
import {
  Conversation,
  ConversationConnection,
  ConversationFilterInput,
  PaginationInput,
  CreateConversationInput,
  UpdateConversationInput,
  ConversationStats,
} from './dto/conversation.dto';

@Resolver(() => Conversation)
export class ConversationsResolver {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Query(() => ConversationConnection, { name: 'conversations' })
  async getConversations(
    @Context() context: any,
    @Args('pagination', { type: () => PaginationInput, nullable: true })
    pagination?: PaginationInput,
    @Args('filters', { type: () => ConversationFilterInput, nullable: true })
    filters?: ConversationFilterInput,
  ): Promise<ConversationConnection> {
    const shopifyDomain =
      context.req.headers['x-shopify-shop-domain'] || 'test-shop.myshopify.com';

    return this.conversationsService.findAll(
      shopifyDomain,
      pagination,
      filters,
    );
  }

  @Query(() => Conversation, { name: 'conversation' })
  async getConversation(
    @Context() context: any,
    @Args('id', { type: () => String }) id: string,
  ): Promise<Conversation> {
    const shopifyDomain =
      context.req.headers['x-shopify-shop-domain'] || 'test-shop.myshopify.com';
    return this.conversationsService.findOne(id, shopifyDomain);
  }

  @Mutation(() => Conversation)
  async createConversation(
    @Context() context: any,
    @Args('input', { type: () => CreateConversationInput })
    input: CreateConversationInput,
  ): Promise<Conversation> {
    const shopifyDomain =
      context.req.headers['x-shopify-shop-domain'] || 'test-shop.myshopify.com';
    return this.conversationsService.create({ ...input, shopifyDomain });
  }

  @Mutation(() => Conversation)
  async updateConversation(
    @Context() context: any,
    @Args('id', { type: () => String }) id: string,
    @Args('input', { type: () => UpdateConversationInput })
    input: UpdateConversationInput,
  ): Promise<Conversation> {
    const shopifyDomain =
      context.req.headers['x-shopify-shop-domain'] || 'test-shop.myshopify.com';
    return this.conversationsService.update(id, shopifyDomain, input);
  }

  @Mutation(() => Boolean)
  async deleteConversation(
    @Context() context: any,
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    const shopifyDomain =
      context.req.headers['x-shopify-shop-domain'] || 'test-shop.myshopify.com';
    return this.conversationsService.remove(id, shopifyDomain);
  }

  @Query(() => ConversationStats, { name: 'conversationStats' })
  async getConversationStats(
    @Context() context: any,
  ): Promise<ConversationStats> {
    const shopifyDomain =
      context.req.headers['x-shopify-shop-domain'] || 'test-shop.myshopify.com';
    return await this.conversationsService.getStats(shopifyDomain);
  }
}
