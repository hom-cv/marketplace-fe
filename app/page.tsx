"use client";

import {
  Badge,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconArrowRight,
  IconMessage,
  IconSearch,
  IconShieldCheck,
  IconShoppingBag,
} from "@tabler/icons-react";
import Link from "next/link";
import Navbar from "./components/Navbar/Navbar";
import classes from "./page.module.css";

const features = [
  {
    icon: <IconShoppingBag size={24} />,
    title: "Curated Selection",
    description:
      "Discover unique pieces from trusted sellers worldwide, each item carefully vetted for authenticity.",
  },
  {
    icon: <IconShieldCheck size={24} />,
    title: "Verified Sellers",
    description:
      "Shop confidently with our community of authenticated fashion enthusiasts and expert collectors.",
  },
  {
    icon: <IconMessage size={24} />,
    title: "Direct Communication",
    description:
      "Connect seamlessly with sellers to discuss details, negotiate prices, and learn item history.",
  },
  {
    icon: <IconSearch size={24} />,
    title: "Smart Discovery",
    description:
      "Find exactly what you're looking for with our intelligent search and filtering system.",
  },
];

const stats = [
  { value: "10K+", label: "Active Listings" },
  { value: "5K+", label: "Verified Sellers" },
  { value: "50K+", label: "Happy Customers" },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <div className={classes.hero}>
          <Container size="lg">
            <div className={classes.heroContent}>
              <Badge variant="light" size="lg" className={classes.badge}>
                The Future of Fashion Resale
              </Badge>
              <Title className={classes.title}>
                Your Destination for
                <br />
                <span className={classes.highlight}>Curated Fashion</span>
              </Title>
              <Text className={classes.description}>
                Join our thriving community of fashion enthusiasts. Discover
                authentic pieces, connect with verified sellers, and find your
                next statement piece.
              </Text>
              <Group className={classes.buttons} justify="center">
                <Button
                  component={Link}
                  href="/auth/register"
                  size="lg"
                  radius="xs"
                  rightSection={<IconArrowRight size={16} />}
                  className={classes.control}
                >
                  Get Started
                </Button>
                <Button
                  component={Link}
                  href="/listings"
                  size="lg"
                  radius="xs"
                  variant="outline"
                  className={classes.control}
                >
                  Browse Listings
                </Button>
              </Group>

              {/* Stats */}
              <div className={classes.stats}>
                {stats.map((stat, index) => (
                  <div key={index} className={classes.stat}>
                    <Text className={classes.statValue}>{stat.value}</Text>
                    <Text size="sm" c="dimmed">
                      {stat.label}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>

        {/* Features Section */}
        <Container size="lg" className={classes.features}>
          <Badge variant="light" size="lg" className={classes.badge}>
            Why Choose Us
          </Badge>
          <Title order={2} className={classes.featuresTitle} ta="center">
            The Market Archives Experience
          </Title>
          <Text
            c="dimmed"
            className={classes.featuresDescription}
            ta="center"
            maw={600}
            mx="auto"
          >
            We&apos;ve crafted a seamless platform that brings together fashion
            enthusiasts, collectors, and sellers in one vibrant community.
          </Text>
          <div className={classes.featureGrid}>
            {features.map((feature, index) => (
              <div key={index} className={classes.feature}>
                <div className={classes.featureIcon}>{feature.icon}</div>
                <Text size="lg" fw={500} mt="md">
                  {feature.title}
                </Text>
                <Text size="sm" c="dimmed" mt={7}>
                  {feature.description}
                </Text>
              </div>
            ))}
          </div>
        </Container>

        {/* CTA Section */}
        <div className={classes.cta}>
          <Container size="lg">
            <Stack align="center" gap="xl">
              <Badge variant="light" size="lg" className={classes.badge}>
                Join Today
              </Badge>
              <Title order={2} className={classes.ctaTitle} ta="center">
                Ready to Transform Your Fashion Journey?
              </Title>
              <Text size="lg" c="dimmed" maw={600} ta="center">
                Whether you&apos;re looking to discover unique pieces or share
                your collection with the world, Market Archives is your
                destination.
              </Text>
              <Group gap="md">
                <Button
                  component={Link}
                  href="/auth/register"
                  size="lg"
                  radius="xs"
                  rightSection={<IconArrowRight size={16} />}
                  className={classes.control}
                >
                  Create Account
                </Button>
                <Button
                  component={Link}
                  href="/listings"
                  size="lg"
                  radius="xs"
                  variant="outline"
                  className={classes.control}
                >
                  Explore First
                </Button>
              </Group>
            </Stack>
          </Container>
        </div>
      </main>
    </>
  );
}
