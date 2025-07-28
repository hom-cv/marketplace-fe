"use client";

import AddressSelector from "@/components/AddressSelector";
import { Address } from "@/schemas/address";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Stepper,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft, IconMapPin, IconReceipt } from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface CheckoutPageProps {
  params: {
    id: string;
  };
}

interface Listing {
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
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const SHIPPING_COST = 50;
const STEPS = [
  {
    label: "Shipping Address",
    description: "Enter your delivery details",
    icon: <IconMapPin size={16} />,
  },
  {
    label: "Review & Pay",
    description: "Review order and complete payment",
    icon: <IconReceipt size={16} />,
  },
];

const calculateTotal = (price: number) => price + SHIPPING_COST;
const formatPrice = (price: number) => `฿${price.toFixed(2)}`;

const OrderSummary = ({ listing }: { listing: Listing }) => {
  const total = calculateTotal(listing.price);

  return (
    <Paper shadow="xs" withBorder p="lg">
      <Title order={3} mb="md">
        Order Summary
      </Title>
      <Stack gap="md">
        <Group>
          <Image
            src={
              listing.image_url ||
              "https://blocks.astratic.com/img/general-img-landscape.png"
            }
            alt={listing.title}
            width={80}
            height={80}
            fit="cover"
            radius="md"
          />
          <Box style={{ flex: 1 }}>
            <Text fw={600} size="sm" lineClamp={2}>
              {listing.title}
            </Text>
            <Text size="sm" c="dimmed">
              Size: {listing.size}
            </Text>
            <Text size="sm" c="dimmed">
              Seller: {listing.seller.username}
            </Text>
          </Box>
        </Group>
        <Divider />
        <Stack gap="xs">
          <Group justify="space-between">
            <Text>Item Price:</Text>
            <Text>{formatPrice(listing.price)}</Text>
          </Group>
          <Group justify="space-between">
            <Text>Shipping:</Text>
            <Text>{formatPrice(SHIPPING_COST)}</Text>
          </Group>
          <Divider />
          <Group justify="space-between" fw={600}>
            <Text size="lg">Total:</Text>
            <Text size="lg" c="dark">
              {formatPrice(total)}
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Paper>
  );
};

const OrderReview = ({
  shippingAddress,
  listing,
}: {
  shippingAddress: ShippingAddress;
  listing: Listing;
}) => (
  <Paper shadow="xs" withBorder p="lg">
    <Title order={3} mb="md">
      Review Your Order
    </Title>
    <Stack gap="md">
      <Box>
        <Text fw={600} mb="xs">
          Shipping Address:
        </Text>
        <Text size="sm" c="dimmed">
          {shippingAddress.fullName}
        </Text>
        <Text size="sm" c="dimmed">
          {shippingAddress.phone}
        </Text>
        <Text size="sm" c="dimmed">
          {shippingAddress.address}
        </Text>
        <Text size="sm" c="dimmed">
          {shippingAddress.city}, {shippingAddress.postalCode}
        </Text>
        <Text size="sm" c="dimmed">
          {shippingAddress.country}
        </Text>
      </Box>
      <Divider />
      <Box>
        <Text fw={600} mb="xs">
          Order Details:
        </Text>
        <Text size="sm" c="dimmed">
          Item: {listing.title}
        </Text>
        <Text size="sm" c="dimmed">
          Size: {listing.size}
        </Text>
        <Text size="sm" c="dimmed">
          Seller: {listing.seller.username}
        </Text>
      </Box>
    </Stack>
  </Paper>
);

const OmisePaymentForm = ({
  listing,
  omiseContainerRef,
  paymentLoading,
}: {
  listing: Listing;
  omiseContainerRef: React.RefObject<HTMLDivElement | null>;
  paymentLoading: boolean;
}) => {
  const total = calculateTotal(listing.price);

  return (
    <Paper shadow="xs" withBorder p="lg">
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          By clicking &quot;Pay Now&quot;, you agree to our terms of service and
          privacy policy.
        </Text>
        <form id="checkoutForm" action={`/listings/${listing.id}/payment`}>
          <input type="hidden" name="omiseToken" />
          <input type="hidden" name="omiseSource" />
          <Button
            type="submit"
            id="checkoutButton"
            size="lg"
            fullWidth
            loading={paymentLoading}
            disabled={paymentLoading}
          >
            Pay {formatPrice(total)}
          </Button>
        </form>
        <div ref={omiseContainerRef} id="omise-payment"></div>
      </Stack>
    </Paper>
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const omiseContainerRef = useRef<HTMLDivElement | null>(null);

  const [activeStep, setActiveStep] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Thailand",
  });

  useEffect(() => {
    fetchListing();
  }, []);

  useEffect(() => {
    if (activeStep === 1 && omiseContainerRef.current) {
      injectOmiseScript();
    } else {
      setPaymentLoading(false);
    }
    return () => cleanupOmiseScript();
  }, [activeStep, listing?.price]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const { getListing } = await import("../../actions");
      const data = await getListing(Number(params.id));
      setListing(data);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to fetch listing details",
        color: "red",
      });
      router.push(`/listings/${params.id}`);
    } finally {
      setLoading(false);
    }
  };

  const updateShippingAddress = (address: Address) => {
    setShippingAddress({
      fullName: "",
      phone: "",
      address: address.street,
      city: address.city,
      postalCode: address.postal_code,
      country: address.country,
    });
  };

  const handleAddressSelect = (address: Address | null) => {
    setSelectedAddress(address);
    if (address) {
      updateShippingAddress(address);
    }
  };

  const handleContactInfoChange = (
    field: "fullName" | "phone",
    value: string
  ) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    } else {
      router.push(`/listings/${params.id}`);
    }
  };

  const handleNext = () => {
    const requiredFields: (keyof ShippingAddress)[] = [
      "fullName",
      "phone",
      "address",
      "city",
      "postalCode",
    ];

    const missingFields = requiredFields.filter(
      (field) => !shippingAddress[field].trim()
    );

    if (missingFields.length > 0) {
      notifications.show({
        title: "Missing Information",
        message: `Please fill in: ${missingFields.join(", ")}`,
        color: "red",
      });
      return;
    }

    setActiveStep(1);
  };

  const injectOmiseScript = () => {
    if (!omiseContainerRef.current || !listing) return;

    // Clean up any existing scripts
    cleanupOmiseScript();

    // Load Omise.js script
    const script = document.createElement("script");
    script.id = "omise-js";
    script.type = "text/javascript";
    script.src = "https://cdn.omise.co/omise.js";

    script.onload = () => {
      // Configure OmiseCard once script is loaded
      if (typeof window !== "undefined" && window.OmiseCard) {
        window.OmiseCard.configure({
          publicKey: process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY || "",
        });

        // Get form and button elements
        const button = document.querySelector("#checkoutButton");
        const form = document.querySelector("#checkoutForm") as HTMLFormElement;

        if (button && form) {
          button.addEventListener("click", (event) => {
            event.preventDefault();
            setPaymentLoading(true);

            window.OmiseCard.open({
              amount: (calculateTotal(listing.price) * 100).toString(),
              currency: "THB",
              defaultPaymentMethod: "credit_card",
              otherPaymentMethods: ["internet_banking", "alipay"],
              onCreateTokenSuccess: (nonce: string) => {
                setPaymentLoading(false);
                if (nonce.startsWith("tokn_")) {
                  (
                    form.querySelector(
                      'input[name="omiseToken"]'
                    ) as HTMLInputElement
                  ).value = nonce;
                } else {
                  (
                    form.querySelector(
                      'input[name="omiseSource"]'
                    ) as HTMLInputElement
                  ).value = nonce;
                }
                form.submit();
              },
              onFormClosed: () => {
                setPaymentLoading(false);
                console.log("Omise form closed");
              },
            });
          });
        }
      } else {
        notifications.show({
          title: "Error",
          message:
            "Failed to load payment system. Please refresh the page and try again.",
          color: "red",
        });
      }
    };

    script.onerror = () => {
      notifications.show({
        title: "Error",
        message:
          "Failed to load payment system. Please check your internet connection and try again.",
        color: "red",
      });
    };

    omiseContainerRef.current.appendChild(script);
  };

  const cleanupOmiseScript = () => {
    if (omiseContainerRef.current) {
      omiseContainerRef.current.innerHTML = "";
    }

    // Reset payment loading state
    setPaymentLoading(false);

    // Remove event listeners
    const button = document.querySelector("#checkoutButton");
    if (button) {
      button.removeEventListener("click", () => {});
    }

    // Clean up OmiseCard if it exists
    if (typeof window !== "undefined" && window.OmiseCard) {
      try {
        window.OmiseCard.close();
      } catch (e) {
        // Ignore errors if OmiseCard is not open
      }
    }
  };

  if (loading) {
    return (
      <Container size="lg" py={{ base: "md", sm: "xl" }}>
        <Stack align="center" py="xl">
          <Text>Loading listing details...</Text>
        </Stack>
      </Container>
    );
  }

  if (!listing) {
    return (
      <Container size="lg" py={{ base: "md", sm: "xl" }}>
        <Stack align="center" py="xl">
          <Text c="red">Listing not found</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg" py={{ base: "md", sm: "xl" }}>
      <Group mb="xl">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={handleBack}
        >
          {activeStep === 0 ? "Back to Listing" : "Back to Address"}
        </Button>
      </Group>

      <Title order={2} mb="xl">
        Complete Your Purchase
      </Title>

      <Paper shadow="xs" withBorder p="lg" mb="xl">
        <Stepper
          active={activeStep}
          onStepClick={setActiveStep}
          allowNextStepsSelect={false}
          size="sm"
        >
          {STEPS.map((step, index) => (
            <Stepper.Step
              key={index}
              label={step.label}
              description={step.description}
              icon={step.icon}
            />
          ))}
        </Stepper>
      </Paper>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <OrderSummary listing={listing} />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          {activeStep === 0 ? (
            <Stack gap="md">
              <Paper shadow="xs" withBorder p="lg">
                <Title order={4} mb="md">
                  Shipping Address
                </Title>
                <AddressSelector
                  mode="select"
                  selectedAddress={selectedAddress}
                  onAddressSelect={handleAddressSelect}
                  showContactInfo={true}
                  contactInfo={{
                    fullName: shippingAddress.fullName,
                    phone: shippingAddress.phone,
                  }}
                  onContactInfoChange={handleContactInfoChange}
                />
              </Paper>

              <Button
                size="lg"
                fullWidth
                onClick={handleNext}
                disabled={
                  !selectedAddress ||
                  !shippingAddress.fullName ||
                  !shippingAddress.phone
                }
              >
                Next: Review & Pay
              </Button>
            </Stack>
          ) : (
            <Stack gap="md">
              <OrderReview
                shippingAddress={shippingAddress}
                listing={listing}
              />
              <OmisePaymentForm
                listing={listing}
                omiseContainerRef={omiseContainerRef}
                paymentLoading={paymentLoading}
              />
            </Stack>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}
