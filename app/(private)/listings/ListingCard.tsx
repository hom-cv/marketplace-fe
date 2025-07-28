"use client";

import { Card, Group, Image, Stack, Text } from "@mantine/core";
import LikeButton from "app/components/LikeButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classes from "./Listings.module.css"; // optional styling file

interface ListingCardProps {
  listing: {
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
    is_liked?: boolean;
    status?: string;
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  const router = useRouter();
  const isSold = listing.status === "SOLD";

  return (
    <Card
      shadow="sm"
      padding="lg"
      withBorder
      maw={300}
      component={Link}
      href={`/listings/${listing.id}`}
      className={classes.card}
      style={{
        opacity: isSold ? 0.6 : 1,
        filter: isSold ? "grayscale(1)" : "none",
      }}
    >
      <Card.Section pos="relative">
        <Image
          src="https://blocks.astratic.com/img/general-img-landscape.png"
          height={160}
          alt={listing.title}
        />
        <Group pos="absolute" top={8} right={8}>
          <LikeButton
            listingId={listing.id}
            initialIsLiked={listing.is_liked}
            size="md"
          />
        </Group>
      </Card.Section>

      <Stack gap="xs" mt="md">
        <Group justify="space-between">
          <Text fw={500} lineClamp={1} maw={180}>
            {listing.title}
          </Text>
          <Text fw={500} lineClamp={1}>
            {listing.size}
          </Text>
        </Group>

        <Text size="sm" c="dimmed" lineClamp={1}>
          {listing.description}
        </Text>
        <Group justify="space-between">
          <Text
            variant="light"
            c={isSold ? "dimmed" : "inherit"}
            fw={isSold && 700}
          >
            {isSold ? "SOLD" : `฿${listing.price.toFixed(2)}`}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
