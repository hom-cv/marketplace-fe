import apiClient from "lib/api-client";

export async function getListings() {
  try {
    const response = await apiClient.get("/listings/with-likes");
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Failed to fetch listings";
    throw new Error(message);
  }
}

export async function createListing(data: {
  title: string;
  description: string;
  price: number;
  image_url?: string;
}) {
  try {
    const response = await apiClient.post("/listings", data);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Failed to create listing";
    throw new Error(message);
  }
}

export async function getListing(id: number) {
  try {
    const response = await apiClient.get(`/listings/${id}`);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Failed to fetch listing";
    throw new Error(message);
  }
}
