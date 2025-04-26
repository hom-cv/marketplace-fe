"use client";

import { Container, Title } from "@mantine/core";
import ChatContainer from "./ChatContainer";

export default function ChatPage() {
  return (
    <Container size="lg" py="xl">
      <Title order={2}>My Messages</Title>
      <ChatContainer />
    </Container>
  );
}
