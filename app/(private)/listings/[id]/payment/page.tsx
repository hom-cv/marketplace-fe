"use client";

import {
  Alert,
  Box,
  Button,
  Container,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck, IconX } from "@tabler/icons-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createCharge } from "./actions";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<
    "processing" | "success" | "error"
  >("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const listingId = params.id;
  const omiseToken = searchParams.get("omiseToken");
  const omiseSource = searchParams.get("omiseSource");

  useEffect(() => {
    processPayment();
  }, []);

  const processPayment = async () => {
    try {
      setIsProcessing(true);
      setPaymentStatus("processing");

      // Validate required parameters
      if (!omiseToken && !omiseSource) {
        throw new Error("Missing payment token or source");
      }

      // Validate listing ID
      if (!listingId || typeof listingId !== "string") {
        throw new Error("Invalid listing ID");
      }

      // Prepare payment data
      const paymentData = {
        listing_id: parseInt(listingId),
        omise_token: omiseToken || "",
        omise_source: omiseSource || "",
      };

      // Call the API to create charge
      await createCharge(paymentData);

      setPaymentStatus("success");
      notifications.show({
        title: "Payment Successful",
        message: "Your payment has been processed successfully!",
        color: "green",
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );

      notifications.show({
        title: "Payment Failed",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        color: "red",
        icon: <IconX size={16} />,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToListing = () => {
    router.push(`/listings/${listingId}`);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleRetry = () => {
    router.push(`/listings/${listingId}`);
  };

  if (isProcessing) {
    return (
      <Container size="sm" py="xl">
        <Paper shadow="xs" withBorder p="xl">
          <Stack align="center" gap="lg">
            <Loader size="lg" />
            <Title order={3}>Processing Payment</Title>
            <Text c="dimmed" ta="center">
              Please wait while we process your payment...
            </Text>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Paper shadow="xs" withBorder p="xl">
        <Stack align="center" gap="lg">
          {paymentStatus === "success" ? (
            <>
              <Box
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "var(--mantine-color-green-1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconCheck size={40} color="var(--mantine-color-green-6)" />
              </Box>
              <Title order={2} ta="center">
                Payment Successful!
              </Title>
              <Text c="dimmed" ta="center" size="lg">
                Thank you for your purchase. Your order has been confirmed.
              </Text>
              <Stack gap="sm" w="100%">
                <Button size="lg" fullWidth onClick={handleBackToListing}>
                  View Order Details
                </Button>
                <Button variant="light" fullWidth onClick={handleBackToHome}>
                  Continue Shopping
                </Button>
              </Stack>
            </>
          ) : (
            <>
              <Box
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "var(--mantine-color-red-1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconX size={40} color="var(--mantine-color-red-6)" />
              </Box>
              <Title order={2} ta="center">
                Payment Failed
              </Title>
              <Text c="dimmed" ta="center" size="lg">
                We couldn&apos;t process your payment. Please try again.
              </Text>

              {errorMessage && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Error Details"
                  color="red"
                  variant="light"
                  w="100%"
                >
                  {errorMessage}
                </Alert>
              )}

              <Stack gap="sm" w="100%">
                <Button size="lg" fullWidth onClick={handleRetry}>
                  Try Again
                </Button>
                <Button variant="light" fullWidth onClick={handleBackToHome}>
                  Back to Home
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
