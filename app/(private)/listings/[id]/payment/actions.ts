import apiClient from "lib/api-client";

export async function createCharge(data: {
  listing_id: number;
  omise_token: string;
  omise_source: string;
}) {
  try {
    const response = await apiClient.post("/charges", data);

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Failed to process payment";
    throw new Error(message);
  }
}
