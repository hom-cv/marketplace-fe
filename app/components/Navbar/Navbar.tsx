import { useUserStore } from "@/store/userStore";
import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHeart, IconMail, IconShirt, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import classes from "./Navbar.module.css";

export default function Navbar() {
  const { user } = useUserStore.getState();
  const [opened, { toggle, close }] = useDisclosure(false);

  const menuItems = user ? (
    <Stack>
      <Button
        component={Link}
        href="/listings"
        onClick={close}
        mt="auto"
        variant="outline"
      >
        Explore
      </Button>
      <Button
        variant="transparent"
        onClick={close}
        leftSection={<IconUser />}
        justify="flex-start"
        fullWidth
        component={Link}
        href="/profile"
      >
        Profile
      </Button>
      <Button
        variant="transparent"
        onClick={close}
        leftSection={<IconHeart />}
        justify="flex-start"
        fullWidth
        component={Link}
        href="/likes"
      >
        My Likes
      </Button>
      <Button
        variant="transparent"
        onClick={close}
        leftSection={<IconMail />}
        justify="flex-start"
        fullWidth
      >
        My Messages
      </Button>
      <Divider />
      <Button
        variant="transparent"
        onClick={close}
        leftSection={<IconShirt />}
        justify="flex-start"
        fullWidth
        component={Link}
        href="/listings"
      >
        Browse Listings
      </Button>
      <Divider />
      <Button onClick={close} fullWidth>
        Logout
      </Button>
    </Stack>
  ) : (
    <Stack>
      <Button
        variant="light"
        component={Link}
        href="/auth/login"
        onClick={close}
        justify="flex-start"
      >
        Login
      </Button>
      <Button
        component={Link}
        href="/auth/register"
        onClick={close}
        justify="flex-start"
      >
        Sign Up
      </Button>
    </Stack>
  );

  return (
    <>
      <nav className={classes.navbar}>
        <Button
          variant="transparent"
          component={Link}
          href="/app"
          className={classes.brand}
        >
          Project Marketplace
        </Button>

        {/* Desktop menu */}
        <Box className={classes.desktop_menu}>
          {user ? (
            <Group gap="md">
              <Button component={Link} href="/listings" variant="outline">
                Explore
              </Button>
              <Button
                variant="transparent"
                size="compact-sm"
                component={Link}
                href="/likes"
              >
                <IconHeart />
              </Button>
              <Button variant="transparent" size="compact-sm">
                <IconMail />
              </Button>
              <Button
                variant="transparent"
                size="compact-sm"
                component={Link}
                href="/profile"
              >
                <IconUser />
              </Button>
            </Group>
          ) : (
            <Group gap="md">
              <Button variant="light" component={Link} href="/auth/login">
                Login
              </Button>
              <Button component={Link} href="/auth/register">
                Sign Up
              </Button>
            </Group>
          )}
        </Box>

        {/* Mobile burger button */}
        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
          hiddenFrom="sm"
        />
      </nav>

      {/* Mobile drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding="md"
        hiddenFrom="sm"
        zIndex={1000}
      >
        {menuItems}
      </Drawer>
    </>
  );
}
