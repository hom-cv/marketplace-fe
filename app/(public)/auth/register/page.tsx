"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import classes from "./Register.module.css";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className={classes.register_container}>
      <Link href="/" className={classes.back_button}>
        <IconArrowLeft className={classes.back_icon} />
        Back to home
      </Link>
      <RegisterForm />
    </div>
  );
}
