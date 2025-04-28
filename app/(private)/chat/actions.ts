import apiClient from "../../../lib/api-client";
import { getCookie } from "../../../lib/util/cookies";
import { ChatHistoryParams, ChatMessage } from "../../types/chat";

interface MessageData {
  content: string;
  listing_id: number;
}

export async function sendMessage(data: MessageData): Promise<ChatMessage> {
  try {
    const response = await apiClient.post(
      `/chat/message/${data.listing_id}`,
      data
    );

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail || error.message || "Failed to send message";
    throw new Error(message);
  }
}

export async function getChatHistory(params: ChatHistoryParams): Promise<any> {
  try {
    const { listing_id, other_user_id, page = 1, page_size = 20 } = params;
    const response = await apiClient.get(`/chat/history`, {
      params: {
        listing_id,
        other_user_id,
        page,
        page_size,
      },
    });

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Failed to fetch chat history";
    throw new Error(message);
  }
}

export async function getChatListings(): Promise<any> {
  try {
    const response = await apiClient.get("/chat/listings");
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Failed to fetch chat listings";
    throw new Error(message);
  }
}

export async function getOnlineUsers(listingId: number): Promise<any> {
  try {
    const response = await apiClient.get(`/chat/online-users/${listingId}`);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Failed to fetch online users";
    throw new Error(message);
  }
}

export function createWebSocketConnection(listingId: number): WebSocket {
  const token = getCookie("access_token");
  if (!token) {
    throw new Error("Authentication token not found");
  }
  const encodedToken = encodeURIComponent(token);

  const wsUrl = `ws://${process.env.NEXT_PUBLIC_API_URL}/chat/ws/${listingId}/${encodedToken}`;
  const socket = new WebSocket(wsUrl);

  return socket;
}
