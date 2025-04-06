import { Button, Center, Text } from "@mantine/core";
import Link from "next/link";
import classes from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={classes.navbar}>
      <Center>
        <Text>Project Marketplace</Text>
      </Center>

      {/* <div className={classes.navbar_items}>
        <Button>+ New Listing</Button>
        <Heart />
        <Mail />
        <Text>Profile</Text>
      </div> */}

      <div className={classes.navbar_items}>
        <Button variant="light" component={Link} href="/auth/login">
          Login
        </Button>
        <Button component={Link} href="/auth/register">
          Sign Up
        </Button>
      </div>
    </nav>
  );
}
