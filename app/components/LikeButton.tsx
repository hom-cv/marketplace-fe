"use client";

import { ActionIcon, Stack, Text, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { addToLikes, removeFromLikes } from "app/(private)/likes/actions";
import { useState } from "react";

interface LikeButtonProps {
  listingId: number;
  initialIsLiked?: boolean;
  initialLikeCount?: number;
  showLikeCount?: boolean;
  size?: string;
}

export default function LikeButton({
  listingId,
  initialIsLiked = false,
  initialLikeCount = 0,
  showLikeCount = false,
  size = "lg",
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleToggleLike = async () => {
    try {
      if (isLiked) {
        await removeFromLikes(listingId);
        setLikeCount((prev) => prev - 1);
      } else {
        await addToLikes(listingId);
        setLikeCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "Operation failed",
        color: "red",
      });
    }
  };

  return (
    <Stack gap={2} align="center">
      <Tooltip label={isLiked ? "Remove from likes" : "Add to likes"}>
        <ActionIcon
          variant="transparent"
          onClick={handleToggleLike}
          size={size}
          m={4}
        >
          {isLiked ? <IconHeartFilled size={24} /> : <IconHeart size={24} />}
        </ActionIcon>
      </Tooltip>
      {showLikeCount && (
        <Text size="sm" c="dimmed">
          {likeCount}
        </Text>
      )}
    </Stack>
  );
}
