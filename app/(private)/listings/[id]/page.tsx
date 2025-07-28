"use client";

import { Container, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getListing } from "../actions";
import ListingDetail from "./ListingDetail";

interface Listing {
  id: number;
  title: string;
  size: string;
  description: string;
  price: number;
  image_url: string;
  created_date: string;
  seller: {
    username: string;
  };
  is_liked: boolean;
  like_count: number;
}

export default function ListingDetailPage() {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListing(Number(params.id));
        setListing({
          ...data,
          is_liked: data.is_liked ?? false,
          like_count: data.like_count ?? 0,
        });
      } catch (error) {
        notifications.show({
          title: "Error",
          message:
            error instanceof Error ? error.message : "Failed to fetch listing",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  if (loading) {
    return (
      <Container size="xl" py={{ base: "md", sm: "xl" }}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (!listing) {
    return (
      <Container size="xl" py={{ base: "md", sm: "xl" }}>
        <Text c="red">Listing not found</Text>
      </Container>
    );
  }

  return <ListingDetail listing={listing} />;
}
