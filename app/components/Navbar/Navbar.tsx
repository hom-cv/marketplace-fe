import { useUserStore } from "@/store/userStore";
import {
  Avatar,
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  Menu,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconHeart,
  IconLayoutGrid,
  IconLogout,
  IconMail,
  IconShoppingBag,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { logout } from "../../actions/auth";
import classes from "./Navbar.module.css";

export default function Navbar() {
  const { user, clearUser } = useUserStore();
  const [opened, { toggle, close }] = useDisclosure(false);

  const handleLogout = async () => {
    clearUser();
    await logout();
  };

  const menuItems = [
    {
      label: "Explore Listings",
      icon: <IconLayoutGrid size={18} />,
      href: "/listings",
    },
    {
      label: "Edit Profile",
      icon: <IconUser size={18} />,
      href: "/profile",
    },
    {
      label: "My Likes",
      icon: <IconHeart size={18} />,
      href: "/likes",
    },
    {
      label: "Messages",
      icon: <IconMail size={18} />,
      href: "/chat",
    },
  ];

  const renderMobileMenu = () => (
    <Box className={classes.mobileMenu}>
      <Box className={classes.mobileHeader}>
        <Group>
          <Avatar radius="xl" size="md" color="gray">
            {user?.first_name?.[0] || user?.email_address?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Text size="sm" fw={500}>
              {user?.first_name || "Welcome"}
            </Text>
            <Text size="xs" c="dimmed">
              {user?.email_address}
            </Text>
          </Box>
        </Group>
      </Box>

      <Divider my="sm" />

      <Stack gap="xs">
        {menuItems.map((item) => (
          <UnstyledButton
            key={item.href}
            component={Link}
            href={item.href}
            onClick={close}
            className={classes.mobileMenuItem}
          >
            {item.icon}
            <Text size="sm">{item.label}</Text>
          </UnstyledButton>
        ))}
      </Stack>

      <Button
        onClick={() => {
          close();
          handleLogout();
        }}
        color="red"
        variant="subtle"
        leftSection={<IconLogout size={18} />}
        radius="xs"
        fullWidth
        className={classes.logoutButton}
      >
        Log out
      </Button>
    </Box>
  );

  return (
    <>
      <nav className={classes.navbar}>
        <div className={classes.navbarContainer}>
          {/* Logo */}
          <Link href="/app" className={classes.brandLink}>
            <IconShoppingBag className={classes.brandIcon} />
            <span className={classes.brandText}>Market Archives</span>
          </Link>

          {/* Desktop Navigation */}
          <div className={classes.desktopMenu}>
            {user ? (
              <Group gap="md">
                <Button
                  component={Link}
                  href="/listings"
                  variant="filled"
                  radius="xs"
                  leftSection={<IconLayoutGrid size={18} />}
                >
                  Explore
                </Button>

                <Menu
                  position="bottom-end"
                  offset={4}
                  withArrow
                  arrowOffset={12}
                  shadow="sm"
                  width={220}
                >
                  <Menu.Target>
                    <UnstyledButton className={classes.userButton}>
                      <Group gap="xs">
                        <Avatar radius="xl" size="sm" color="gray">
                          {user.first_name?.[0] ||
                            user.email_address?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box style={{ flex: 1 }}>
                          <Text size="sm" fw={500}>
                            {user.first_name || "Account"}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {user.email_address}
                          </Text>
                        </Box>
                        <IconChevronDown size={16} color="gray" />
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>

                  <Menu.Dropdown>
                    {menuItems.map((item) => (
                      <Menu.Item
                        key={item.href}
                        component={Link}
                        href={item.href}
                        leftSection={item.icon}
                      >
                        {item.label}
                      </Menu.Item>
                    ))}
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={<IconLogout size={18} />}
                      onClick={handleLogout}
                    >
                      Log out
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            ) : (
              <Group gap="md">
                <Button
                  variant="outline"
                  component={Link}
                  href="/auth/login"
                  radius="xs"
                >
                  Login
                </Button>
                <Button component={Link} href="/auth/register" radius="xs">
                  Sign Up
                </Button>
              </Group>
            )}
          </div>

          {/* Mobile burger button */}
          {user && (
            <Burger
              opened={opened}
              onClick={toggle}
              className={classes.burger}
              size="sm"
              hiddenFrom="sm"
            />
          )}
        </div>
      </nav>

      {/* Mobile drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding={0}
        hiddenFrom="sm"
        zIndex={1000}
        classNames={{
          header: classes.drawerHeader,
          close: classes.drawerClose,
        }}
      >
        {renderMobileMenu()}
      </Drawer>
    </>
  );
}
