import { Center } from "@mantine/core";
import classes from "./Login.module.css";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Center className={classes.login_container}>
      <LoginForm />
    </Center>
  );
}
