"use client";

import { Button, Group, SimpleGrid, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ListingCard from "./ListingCard";
import { getListings } from "./actions";

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  created_at: string;
  seller: {
    username: string;
  };
}

export default function ListingsGrid() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Group justify="space-between" mb="xl">
        <Title order={2}>Listings</Title>
        <Button onClick={() => router.push("/listings/new")}>
          Create Listing
        </Button>
      </Group>

      {listings.length === 0 && !loading ? (
        <Text c="dimmed" ta="center" py="xl">
          No listings found. Be the first to create one!
        </Text>
      ) : (
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 4 }}
          spacing="sm"
          verticalSpacing="sm"
        >
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </SimpleGrid>
      )}
    </>
  );
}
