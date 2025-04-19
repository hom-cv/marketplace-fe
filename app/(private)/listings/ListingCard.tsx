"use client";

import { Button, Card, Group, Image, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  const router = useRouter();

  return (
    <Card shadow="sm" padding="lg" withBorder maw={300}>
      <Card.Section>
        <Image
          src={
            listing.image_url ||
            "https://blocks.astratic.com/img/general-img-landscape.png"
          }
          height={160}
          alt={listing.title}
        />
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
          <Button component={Link} href={`/listings/${listing.id}`}>
            Buy
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
