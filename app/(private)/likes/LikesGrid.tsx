"use client";

import { Center, Group, SimpleGrid, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import ListingCard from "app/(private)/listings/ListingCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getLikedListings } from "./actions";

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

export default function LikesGrid() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getLikedListings();
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

  return (
    <>
      <Group justify="space-between" mb="xl">
        <Title order={2}>My Likes</Title>
      </Group>

      {listings.length === 0 && !loading ? (
        <Text c="dimmed" ta="center" py="xl">
          No likes found. Start exploring to find items you love!
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
