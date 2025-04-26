"use client";

import {
  Box,
  Center,
  Grid,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { ChatListingItem } from "../../types/chat";
import { getChatListings } from "./actions";
import ChatBox from "./ChatBox";
import ChatListings from "./ChatListings";

export default function ChatContainer() {
  const [selectedListing, setSelectedListing] =
    useState<ChatListingItem | null>(null);
  const [chatListings, setChatListings] = useState<ChatListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChatListings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getChatListings();

      setChatListings(data || []);

      // Select first listing by default if available
      if (data.listings && data.listings.length > 0) {
        if (!selectedListing) {
          setSelectedListing(data.listings[0]);
        } else {
          // If we already have a selected listing, keep it selected
          const updatedSelectedListing = data.listings.find(
            (listing: ChatListingItem) =>
              listing.listing_id === selectedListing.listing_id &&
              listing.other_user_id === selectedListing.other_user_id
          );

          if (updatedSelectedListing) {
            setSelectedListing(updatedSelectedListing);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load chat listings");
    } finally {
      setLoading(false);
    }
  }, [selectedListing]);

  // Initial load of chat listings
  useEffect(() => {
    fetchChatListings();
  }, [fetchChatListings]);

  // Set up a refresh interval to periodically update listings
  // This is a fallback in case WebSocket updates fail
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchChatListings();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, [fetchChatListings]);

  if (loading) {
    return (
      <Grid mt="md" gutter="md">
        {/* Skeleton for Chat Listings Column */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper shadow="xs" p="md" withBorder>
            <Stack>
              <Skeleton height={16} width="60%" mb="md" />
              {[1, 2, 3, 4].map((i) => (
                <Group key={i} wrap="nowrap" mb="sm">
                  <Skeleton height={36} circle />
                  <Box style={{ flex: 1 }}>
                    <Skeleton height={10} width="80%" mb={4} />
                    <Skeleton height={8} width="40%" mb={4} />
                    <Skeleton height={8} width="90%" />
                  </Box>
                  <Stack gap={4} align="flex-end">
                    <Skeleton height={8} width={50} />
                    <Skeleton height={16} width={20} radius="xl" />
                  </Stack>
                </Group>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>

        {/* Skeleton for Chat Box Column (Mimics ChatBox skeleton) */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper shadow="xs" p="md" withBorder h="100%">
            <Stack h="100%" gap="xs">
              {/* Header Skeleton */}
              <Group justify="space-between" wrap="nowrap">
                <Group gap="xs">
                  <Skeleton height={36} circle />
                  <Box>
                    <Skeleton height={12} width={150} mb={6} />
                    <Skeleton height={8} width={120} />
                  </Box>
                </Group>
              </Group>

              {/* Message Area Skeleton */}
              <Paper withBorder p="xs" style={{ flex: 1 }}>
                <Stack p="xs" gap="md">
                  <Skeleton height={20} width="60%" radius="xl" />
                  <Skeleton
                    height={20}
                    width="70%"
                    radius="xl"
                    style={{ alignSelf: "flex-end" }}
                  />
                  <Skeleton height={20} width="50%" radius="xl" />
                  <Skeleton
                    height={20}
                    width="65%"
                    radius="xl"
                    style={{ alignSelf: "flex-end" }}
                  />
                  <Skeleton height={20} width="55%" radius="xl" />
                </Stack>
              </Paper>

              {/* Input Area Skeleton */}
              <Group gap="xs">
                <Skeleton height={36} style={{ flex: 1 }} />
                <Skeleton height={36} width={36} circle />
              </Group>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    );
  }

  if (error) {
    return (
      <Center h={300}>
        <Text c="red">{error}</Text>
      </Center>
    );
  }

  return (
    <Grid mt="md" gutter="md">
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Paper shadow="xs" p="md" withBorder>
          <ChatListings
            listings={chatListings}
            selectedListing={selectedListing}
            onSelectListing={setSelectedListing}
            onNewMessage={fetchChatListings}
            loading={loading}
          />
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Paper shadow="xs" p="md" withBorder h="100%">
          {selectedListing ? (
            <ChatBox listing={selectedListing} />
          ) : (
            <Center h={300}>
              <Text c="dimmed">Select a conversation to start chatting</Text>
            </Center>
          )}
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
