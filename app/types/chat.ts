export interface ChatMessage {
  id: number;
  content: string;
  sender_id: number;
  receiver_id: number;
  created_date: string;
  is_read: boolean;
}

export interface ChatListingItem {
  listing_id: number;
  listing_title: string;
  listing_image_url: string;
  last_message_time: string;
  last_message: string;
  unread_count: number;
  other_user_id: number;
  other_user_name: string;
  is_owner: boolean;
}

export interface OnlineUser {
  user_id: number;
  username: string;
}

export interface ChatHistoryResponse {
  messages: ChatMessage[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  other_user_id: number;
  other_user_name: string;
  listing_id: number;
}

export interface ChatHistoryParams {
  listing_id: number;
  other_user_id: number;
  page?: number;
  page_size?: number;
}

export interface WebSocketMessage {
  event: "new_message" | "user_online" | "user_offline";
  data: any;
}
