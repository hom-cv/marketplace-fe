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
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  const router = useRouter();
  console.log(listing);
  return (
    <Card
      shadow="sm"
      padding="lg"
      withBorder
      maw={300}
      component={Link}
      href={`/listings/${listing.id}`}
      className={classes.card}
    >
      <Card.Section pos="relative">
        <Image
          src={
            listing.image_url ||
            "https://blocks.astratic.com/img/general-img-landscape.png"
          }
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
          <Text variant="light">฿{listing.price.toFixed(2)}</Text>
        </Group>
      </Stack>
    </Card>
  );
}
