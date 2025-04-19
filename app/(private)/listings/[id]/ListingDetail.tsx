"use client";

import {
  Box,
  Button,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconHeart, IconUser } from "@tabler/icons-react";
import styles from "./ListingDetail.module.css";

interface ListingDetailProps {
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

export default function ListingDetail({ listing }: ListingDetailProps) {
  const handleContact = () => {
    notifications.show({
      title: "Contact Initiated",
      message: `You're contacting ${listing.seller.username} about "${listing.title}"`,
      color: "blue",
    });
  };

  const ListingInfo = () => (
    <Box className={styles.listingInfoContainer}>
      <Stack gap="md">
        <Group justify="space-between" align="center" wrap="nowrap">
          <Text size="lg" fw={700} className={styles.title} style={{ flex: 1 }}>
            {listing.title}
          </Text>
          <IconHeart size={24} style={{ flexShrink: 0 }} />
        </Group>
        <Text size="md">Size: {listing.size}</Text>
        <Text size="sm" className={styles.description}>
          {listing.description}
        </Text>
        <Text size="xl" fw={700} className={styles.price}>
          ฿{listing.price.toFixed(2)}
        </Text>
        <Button size="sm" fullWidth onClick={handleContact}>
          Purchase
        </Button>
        <Button size="sm" fullWidth onClick={handleContact} variant="outline">
          Message Seller
        </Button>
      </Stack>
    </Box>
  );

  const SellerInfo = () => (
    <Box className={styles.sellerInfoContainer}>
      <Stack gap="xs">
        <Group>
          <IconUser size={24} />
          <Text fw={500}>{listing.seller.username}</Text>
        </Group>
        <Text size="sm" c="dimmed">
          Posted on {new Date(listing.created_date).toLocaleDateString()}
        </Text>
        <Button size="sm" fullWidth onClick={handleContact}>
          Follow
        </Button>
      </Stack>
    </Box>
  );

  // Desktop Layout
  const DesktopLayout = () => (
    <Grid className={styles.desktopLayout}>
      <Grid.Col span={6}>
        <div className={styles.imageWrapper}>
          <Image
            src={
              listing.image_url ||
              "https://blocks.astratic.com/img/general-img-landscape.png"
            }
            alt={listing.title}
            height={400}
            fit="cover"
          />
        </div>
      </Grid.Col>
      <Grid.Col span={6}>
        <Stack gap="md">
          <ListingInfo />
          <SellerInfo />
        </Stack>
      </Grid.Col>
    </Grid>
  );

  // Mobile Layout
  const MobileLayout = () => (
    <Stack gap="md" className={styles.mobileLayout}>
      <div className={styles.imageWrapper}>
        <Image
          src={
            listing.image_url ||
            "https://blocks.astratic.com/img/general-img-landscape.png"
          }
          alt={listing.title}
          height={250}
          fit="cover"
        />
      </div>
      <ListingInfo />
      <SellerInfo />
    </Stack>
  );

  return (
    <Paper p={{ base: "xs", sm: "xl" }} className={styles.detailCard}>
      <Box className={styles.desktopOnly}>
        <DesktopLayout />
      </Box>
      <Box className={styles.mobileOnly}>
        <MobileLayout />
      </Box>
    </Paper>
  );
}
