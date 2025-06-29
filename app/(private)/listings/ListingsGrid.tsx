"use client";

import { useUserStore } from "@/store/userStore";
import { Button, Center, Group, SimpleGrid, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ListingCard from "./ListingCard";
import { getListings } from "./actions";

interface Listing {
  id: number;
  title: string;
  description: string;
  size: string;
  price: number;
  image_url: string;
  created_date: string;
  seller: {
    username: string;
  };
}

export default function ListingsGrid() {
  const router = useRouter();
  const { user } = useUserStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const isVerifiedSeller = !!user?.recipient?.verified;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings();
        setListings(data);
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to load listings",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleNewListing = () => {
    if (!isVerifiedSeller) {
      notifications.show({
        title: "Verification Required",
        message:
          "You need to be a verified seller to create listings. Please complete seller verification in your profile.",
        color: "yellow",
      });
      router.push("/profile?tab=verification");
      return;
    }
    router.push("/listings/new");
  };

  return (
    <>
      <Group justify="space-between" mb="xl">
        <Title order={2}>Listings</Title>

        <Button onClick={handleNewListing}>+ New Listing</Button>
      </Group>

      {listings.length === 0 && !loading ? (
        <Text c="dimmed" ta="center" py="xl">
          No listings found. Be the first to create one!
        </Text>
      ) : (
        <Center>
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 4 }}
            spacing="sm"
            verticalSpacing="md"
          >
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </SimpleGrid>
        </Center>
      )}
    </>
  );
}
