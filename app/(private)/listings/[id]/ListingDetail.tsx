"use client";

import LikeButton from "@/components/LikeButton";
import {
  Box,
  Button,
  Grid,
  Group,
  Image,
  Modal,
  Paper,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconUser } from "@tabler/icons-react";
import { sendMessage } from "app/(private)/chat/actions";
import { useState } from "react";
import styles from "./ListingDetail.module.css";

export interface ListingDetailProps {
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
    is_liked: boolean;
    like_count: number;
  };
}

export default function ListingDetail({ listing }: ListingDetailProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleContact = () => {
    notifications.show({
      title: "Contact Initiated",
      message: `You're contacting ${listing.seller.username} about "${listing.title}"`,
      color: "blue",
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      notifications.show({
        title: "Error",
        message: "Please enter a message",
        color: "red",
      });
      return;
    }

    try {
      setIsSending(true);
      await sendMessage({
        content: message,
        listing_id: listing.id,
      });

      notifications.show({
        title: "Success",
        message: `Message sent to ${listing.seller.username}`,
        color: "green",
      });

      setMessage("");
      close();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to send message",
        color: "red",
      });
    } finally {
      setIsSending(false);
    }
  };

  const ListingInfo = () => (
    <Box className={styles.listingInfoContainer}>
      <Stack gap="sm">
        <Group justify="space-between" align="center" wrap="nowrap">
          <Text size="lg" fw={700} className={styles.title} style={{ flex: 1 }}>
            {listing.title}
          </Text>
          <Stack>
            <LikeButton
              listingId={listing.id}
              initialIsLiked={listing.is_liked}
              initialLikeCount={listing.like_count}
              showLikeCount={true}
              size={"lg"}
            />
          </Stack>
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
        <Button size="sm" fullWidth onClick={open} variant="outline">
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
    <>
      <Paper p={{ base: "xs", sm: "xl" }} className={styles.detailCard}>
        <Box className={styles.desktopOnly}>
          <DesktopLayout />
        </Box>
        <Box className={styles.mobileOnly}>
          <MobileLayout />
        </Box>
      </Paper>

      <Modal
        opened={opened}
        onClose={close}
        title={`Message to ${listing.seller.username}`}
        centered
      >
        <Stack>
          <Textarea
            placeholder="Write your message here..."
            minRows={4}
            value={message}
            onChange={(event) => setMessage(event.currentTarget.value)}
          />
          <Group justify="center" mt="md">
            <Button onClick={handleSendMessage} loading={isSending}>
              Send Message
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
