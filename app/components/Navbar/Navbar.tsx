import { useUserStore } from "@/store/userStore";
import { Button, Center } from "@mantine/core";
import Link from "next/link";
import classes from "./Navbar.module.css";

export default function Navbar() {
  const { user } = useUserStore.getState();

  return (
    <nav className={classes.navbar}>
      <Center>
        <Button variant="transparent" component={Link} href="/app">
          Project Marketplace
        </Button>
      </Center>

      {user ? (
        <div className={classes.navbar_items}>
          <Button component={Link} href="/listings/new">
            + New Listing
          </Button>
          <Button variant="transparent">Profile</Button>
        </div>
      ) : (
        <div className={classes.navbar_items}>
          <Button variant="light" component={Link} href="/auth/login">
            Login
          </Button>
          <Button component={Link} href="/auth/register">
            Sign Up
          </Button>
        </div>
      )}
    </nav>
  );
}
