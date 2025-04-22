import apiClient from "lib/api-client";

export async function getLikedListings() {
  try {
    const response = await apiClient.get("/listings/liked");
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Failed to fetch liked listings";
    throw new Error(message);
  }
}

export async function addToLikes(listingId: number): Promise<void> {
  try {
    await apiClient.post(`/likes/${listingId}`);
  } catch (error: any) {
    const message =
      error.response?.data?.detail || error.message || "Failed to add to likes";
    throw new Error(message);
  }
}

export async function removeFromLikes(listingId: number): Promise<void> {
  try {
    await apiClient.delete(`/likes/${listingId}`);
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Failed to remove from likes";
    throw new Error(message);
  }
}
