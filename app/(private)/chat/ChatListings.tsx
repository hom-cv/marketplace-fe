"use client";

import {
  Avatar,
  Badge,
  Box,
  Center,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { ChatListingItem } from "app/types/chat";
import { formatDistanceToNow } from "date-fns";
import classes from "./ChatListings.module.css";

interface ChatListingsProps {
  listings: ChatListingItem[];
  selectedListing: ChatListingItem | null;
  onSelectListing: (listing: ChatListingItem) => void;
  onNewMessage?: () => void;
  loading: boolean;
}

export default function ChatListings({
  listings,
  selectedListing,
  onSelectListing,
  onNewMessage,
  loading,
}: ChatListingsProps) {
  if (loading) {
    return (
      <Center h={500}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (listings.length === 0) {
    return (
      <Text ta="center" py="xl">
        No messages found
      </Text>
    );
  }

  return (
    <Stack gap="xs">
      <Title order={5} mb="xs">
        Conversations
      </Title>
      <ScrollArea h={500} type="auto">
        <Stack gap="xs">
          {listings.map((listing) => (
            <Box
              key={`${listing.listing_id}-${listing.other_user_id}`}
              className={`${classes.listingItem} ${
                selectedListing &&
                selectedListing.listing_id === listing.listing_id &&
                selectedListing.other_user_id === listing.other_user_id
                  ? classes.selected
                  : ""
              }`}
              onClick={() => onSelectListing(listing)}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group wrap="nowrap">
                  <Avatar
                    src={listing.listing_image_url}
                    alt={listing.listing_title}
                    radius="md"
                    size="md"
                  />
                  <Box>
                    <Text fw={500} lineClamp={1} size="sm">
                      {listing.listing_title}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {listing.other_user_name}
                    </Text>
                    <Text size="xs" lineClamp={1}>
                      {listing.last_message}
                    </Text>
                  </Box>
                </Group>
                <Stack gap={4} align="flex-end">
                  <Text size="xs" c="dimmed">
                    {formatDistanceToNow(new Date(listing.last_message_time), {
                      addSuffix: true,
                    })}
                  </Text>
                  {listing.unread_count > 0 && (
                    <Badge size="sm" variant="filled" radius="xl">
                      {listing.unread_count}
                    </Badge>
                  )}
                </Stack>
              </Group>
            </Box>
          ))}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}
