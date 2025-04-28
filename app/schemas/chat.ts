import { z } from "zod";

export const chatMessageSchema = z.object({
  id: z.number(),
  content: z.string(),
  sender_id: z.number(),
  receiver_id: z.number(),
  created_date: z.string(),
  is_read: z.boolean(),
});

export const chatListingItemSchema = z.object({
  listing_id: z.number(),
  listing_title: z.string(),
  listing_image_url: z.string(),
  last_message_time: z.string(),
  last_message: z.string(),
  unread_count: z.number(),
  other_user_id: z.number(),
  other_user_name: z.string(),
  is_owner: z.boolean(),
});

export const onlineUserSchema = z.object({
  user_id: z.number(),
  username: z.string(),
});

export const chatHistoryParamsSchema = z.object({
  listing_id: z.number(),
  other_user_id: z.number(),
  page: z.number().optional(),
  page_size: z.number().optional(),
});

export const chatHistoryResponseSchema = z.object({
  messages: z.array(chatMessageSchema),
  total_count: z.number(),
  page: z.number(),
  page_size: z.number(),
  total_pages: z.number(),
  other_user_id: z.number(),
  other_user_name: z.string(),
  listing_id: z.number(),
});

export const webSocketMessageSchema = z.object({
  event: z.enum(["new_message", "user_online", "user_offline"]),
  data: z.any(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatListingItem = z.infer<typeof chatListingItemSchema>;
export type OnlineUser = z.infer<typeof onlineUserSchema>;
export type ChatHistoryParams = z.infer<typeof chatHistoryParamsSchema>;
export type ChatHistoryResponse = z.infer<typeof chatHistoryResponseSchema>;
export type WebSocketMessage = z.infer<typeof webSocketMessageSchema>;
