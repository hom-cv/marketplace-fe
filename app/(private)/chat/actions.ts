import apiClient from "lib/api-client";

interface MessageData {
  content: string;
  listing_id: number;
}

export async function sendMessage(data: MessageData): Promise<any> {
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
