"use client";

import LikeButton from "@/components/LikeButton";
import {
  Box,
  Button,
  Container,
  Grid,
  Group,
  Image,
  Modal,
  Paper,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconUser } from "@tabler/icons-react";
import { sendMessage } from "app/(private)/chat/actions";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handlePurchase = () => {
    router.push(`/listings/${listing.id}/checkout`);
  };

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

  return (
    <>
      <Container size="xl" py={{ base: "md", sm: "xl" }}>
        <Title order={2} mb="xl">
          {listing.title}
        </Title>

        <Grid gutter="xl">
          {/* Image Section */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper
              shadow="xs"
              withBorder
              p="md"
              className={styles.imageContainer}
            >
              <Image
                src={
                  listing.image_url ||
                  "https://blocks.astratic.com/img/general-img-landscape.png"
                }
                alt={listing.title}
                height={400}
                fit="cover"
                radius="md"
              />
            </Paper>
          </Grid.Col>

          {/* Details Section */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="lg">
              {/* Listing Info Card */}
              <Paper shadow="xs" withBorder p="lg">
                <Stack gap="md">
                  <Group justify="space-between" align="flex-start">
                    <Box style={{ flex: 1 }}>
                      <Text size="lg" fw={600} mb="xs">
                        {listing.title}
                      </Text>
                      <Text size="md" c="dimmed" mb="xs">
                        Size: {listing.size}
                      </Text>
                      <Text size="sm" lineClamp={3}>
                        {listing.description}
                      </Text>
                    </Box>
                    <LikeButton
                      listingId={listing.id}
                      initialIsLiked={listing.is_liked}
                      initialLikeCount={listing.like_count}
                      showLikeCount={true}
                      size="lg"
                    />
                  </Group>

                  <Text size="xl" fw={700} c="dark">
                    ฿{listing.price.toFixed(2)}
                  </Text>

                  <Group gap="sm">
                    <Button fullWidth onClick={handlePurchase}>
                      Purchase
                    </Button>
                    <Button fullWidth onClick={open} variant="outline">
                      Message Seller
                    </Button>
                  </Group>
                </Stack>
              </Paper>

              {/* Seller Info Card */}
              <Paper shadow="xs" withBorder p="lg">
                <Stack gap="md">
                  <Group>
                    <IconUser size={24} />
                    <Text fw={500}>{listing.seller.username}</Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Posted on{" "}
                    {new Date(listing.created_date).toLocaleDateString()}
                  </Text>
                  <Button fullWidth onClick={handleContact} variant="light">
                    Follow Seller
                  </Button>
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>

      <Modal
        opened={opened}
        onClose={close}
        title={`Message to ${listing.seller.username}`}
        centered
        size="md"
      >
        <Stack gap="md">
          <Textarea
            placeholder="Write your message here..."
            minRows={4}
            value={message}
            onChange={(event) => setMessage(event.currentTarget.value)}
          />
          <Group justify="flex-end" gap="sm">
            <Button variant="light" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} loading={isSending}>
              Send Message
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
