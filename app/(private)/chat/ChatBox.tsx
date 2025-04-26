"use client";

import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconArrowUp, IconSend } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import {
  ChatListingItem,
  ChatMessage,
  WebSocketMessage,
} from "../../types/chat";
import {
  createWebSocketConnection,
  getChatHistory,
  sendMessage,
} from "./actions";
import classes from "./ChatBox.module.css";

interface ChatBoxProps {
  listing: ChatListingItem;
}

export default function ChatBox({ listing }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const scrollPositionRef = useRef<number>(0);
  const initialLoadComplete = useRef(false);
  const PAGE_SIZE = 20;

  const focusMessageInput = () => {
    setTimeout(() => {
      const input = document.getElementById(
        "message-input"
      ) as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 50);
  };

  const loadChatHistory = async (page = 1, preserveScroll = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
        // Save current scroll position before loading more
        if (preserveScroll && viewportRef.current) {
          scrollPositionRef.current = viewportRef.current.scrollTop;
        }
      }

      const data = await getChatHistory({
        listing_id: listing.listing_id,
        other_user_id: listing.other_user_id,
        page,
        page_size: PAGE_SIZE,
      });

      const newMessages = (data.messages || []).reverse();

      if (page === 1) {
        // Initial load, just set the messages
        setMessages(newMessages);
        // Check if there are more pages
        setHasMoreMessages(data.total_pages > 1);
      } else {
        // Load more, prepend to existing messages
        setMessages((prevMessages) => [...newMessages, ...prevMessages]);
      }

      // Update current page
      setCurrentPage(page);
      // Check if we still have more messages to load
      setHasMoreMessages(page < data.total_pages);
    } catch (err: any) {
      setError(err.message || "Failed to load chat history");
    } finally {
      if (page === 1) {
        setLoading(false);
      } else {
        // First set loadingMore to false
        setLoadingMore(false);

        // Then restore scroll position after loading more (with a slight delay)
        if (preserveScroll && viewportRef.current) {
          // Use a slightly longer timeout to ensure DOM has updated
          setTimeout(() => {
            if (viewportRef.current) {
              // Simply restore the previous scroll position
              viewportRef.current.scrollTop = scrollPositionRef.current;
            }
          }, 50);
        }
      }
    }
  };

  const handleLoadMore = () => {
    if (hasMoreMessages && !loadingMore) {
      loadChatHistory(currentPage + 1, true);
    }
  };

  // Setup WebSocket connection
  useEffect(() => {
    // Close previous connection if exists
    if (socketRef.current) {
      socketRef.current.close();
    }

    // Create new WebSocket connection
    try {
      const socket = createWebSocketConnection(listing.listing_id);

      socket.onopen = () => {
        console.log("WebSocket connected");
      };

      socket.onmessage = (event) => {
        const wsData = JSON.parse(event.data) as WebSocketMessage;

        if (wsData.event === "new_message") {
          // Add new message to the *end* of the chat
          const newMsg = wsData.data as ChatMessage;
          setMessages((prev) => [...prev, newMsg]);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      socketRef.current = socket;
    } catch (err: any) {
      console.error("Failed to connect to WebSocket:", err);
      setError("Failed to connect to real-time chat. Messages may be delayed.");
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [listing.listing_id]);

  // Load initial chat history when listing changes
  useEffect(() => {
    setMessages([]);
    setCurrentPage(1);
    setHasMoreMessages(false);
    initialLoadComplete.current = false;
    loadChatHistory(1);
  }, [listing.listing_id, listing.other_user_id, loadChatHistory]);

  // Scroll to bottom: Instant on initial load, smooth for new messages
  useEffect(() => {
    if (viewportRef.current) {
      if (!loading && !loadingMore) {
        // Determine scroll behavior
        const behavior = initialLoadComplete.current ? "smooth" : "auto";

        viewportRef.current.scrollTo({
          top: viewportRef.current.scrollHeight,
          behavior: behavior,
        });

        // Mark initial load as complete after the first non-loading scroll
        if (!initialLoadComplete.current && !loading) {
          initialLoadComplete.current = true;
        }
      }
    }
  }, [messages.length, loading, loadingMore]);

  // Also focus when conversation changes
  useEffect(() => {
    if (!loading) {
      focusMessageInput();
    }
  }, [loading, listing.listing_id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempMessageContent = newMessage;
    setNewMessage(""); // Clear input immediately for better UX

    try {
      setSending(true);
      const createdMessage = await sendMessage({
        content: tempMessageContent,
        listing_id: listing.listing_id,
      });

      // Manually add the sent message to the state
      setMessages((prev) => [...prev, createdMessage]);

      // Focus the input
      focusMessageInput();

      // Scroll to bottom after adding message
      setTimeout(() => {
        if (viewportRef.current) {
          viewportRef.current.scrollTo({
            top: viewportRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 0);
    } catch (err: any) {
      setError(err.message || "Failed to send message");
      // Restore the message in the input field if sending failed
      setNewMessage(tempMessageContent);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Stack h="100%" gap="xs">
        {/* Skeleton for Header */}
        <Group justify="space-between" wrap="nowrap">
          <Group gap="xs">
            <Skeleton height={36} circle />
            <Box>
              <Skeleton height={12} width={150} mb={6} />
              <Skeleton height={8} width={120} />
            </Box>
          </Group>
        </Group>

        {/* Skeleton for Message Area */}
        <Paper withBorder p="xs" h="448px" className={classes.chatContainer}>
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

        {/* Skeleton for Input Area */}
        <Group gap="xs">
          <Skeleton height={36} style={{ flex: 1 }} />
          <Skeleton height={36} width={36} circle />
        </Group>
      </Stack>
    );
  }

  return (
    <Stack h="100%" gap="xs">
      <Group justify="space-between" wrap="nowrap">
        <Group gap="xs">
          <Avatar
            src={listing.listing_image_url}
            alt={listing.listing_title}
            radius="md"
            size="md"
          />
          <Box>
            <Text fw={500}>{listing.listing_title}</Text>
            <Text size="xs" c="dimmed">
              Chatting with {listing.other_user_name}
            </Text>
          </Box>
        </Group>
      </Group>

      {error && (
        <Text c="red" ta="center">
          {error}
        </Text>
      )}

      <Paper withBorder p="xs" h="100%" className={classes.chatContainer}>
        <ScrollArea
          h="100%"
          viewportRef={viewportRef}
          type="auto"
          className={classes.chatScrollArea}
        >
          {messages.length === 0 ? (
            <Text ta="center" c="dimmed" py="xl">
              No messages yet. Start the conversation!
            </Text>
          ) : (
            <Stack gap="xs" p="xs">
              {hasMoreMessages && (
                <Center py="xs">
                  <Button
                    variant="subtle"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    leftSection={
                      loadingMore ? (
                        <Loader size={14} />
                      ) : (
                        <IconArrowUp size="1rem" />
                      )
                    }
                    size="xs"
                  >
                    Load older messages
                  </Button>
                </Center>
              )}

              {messages.map((message) => (
                <Box
                  key={message.id}
                  className={`${classes.message} ${
                    message.sender_id === listing.other_user_id
                      ? classes.receivedMessage
                      : classes.sentMessage
                  }`}
                >
                  <Text size="sm">{message.content}</Text>
                  <Text size="xs" c="dimmed" className={classes.messageTime}>
                    {new Date(message.created_date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </Box>
              ))}
            </Stack>
          )}
        </ScrollArea>
      </Paper>

      <Group gap="xs">
        <TextInput
          id="message-input"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={sending}
          style={{ flex: 1 }}
          autoFocus
        />
        <ActionIcon
          variant="filled"
          color="blue"
          onClick={handleSendMessage}
          loading={sending}
          disabled={!newMessage.trim()}
        >
          <IconSend size="1.2rem" />
        </ActionIcon>
      </Group>
    </Stack>
  );
}
