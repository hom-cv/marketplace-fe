"use client";

import { Center } from "@mantine/core";
import classes from "./Register.module.css";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <Center className={classes.register_container}>
      <RegisterForm />
    </Center>
  );
}
