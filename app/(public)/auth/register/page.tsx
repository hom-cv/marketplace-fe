"use client";

import { Center } from "@mantine/core";
import classes from "../login/Login.module.css";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <Center className={classes.login_container}>
      <RegisterForm />
    </Center>
  );
}
