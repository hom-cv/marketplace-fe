import { useUserStore } from "@/store/userStore";
import {
  ActionIcon,
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  Menu,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconHeart,
  IconLogout,
  IconMail,
  IconShirt,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { logout } from "../../actions/auth";
import classes from "./Navbar.module.css";

export default function Navbar() {
  const { user, clearUser } = useUserStore();
  const [opened, { toggle, close }] = useDisclosure(false);

  const handleLogout = async () => {
    // Clear user from store
    clearUser();
    // Call server action to logout
    await logout();
  };

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
      <Button
        onClick={() => {
          close();
          handleLogout();
        }}
        leftSection={<IconLogout />}
        color="red"
        variant="light"
        fullWidth
      >
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
              <ActionIcon
                variant="transparent"
                size="compact-sm"
                component={Link}
                href="/likes"
              >
                <IconHeart />
              </ActionIcon>
              <ActionIcon variant="transparent" size="compact-sm">
                <IconMail />
              </ActionIcon>
              <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                  <ActionIcon variant="transparent" size="compact-sm">
                    <IconUser />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item
                    component={Link}
                    href="/profile"
                    leftSection={<IconUser size={16} />}
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={16} />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
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
