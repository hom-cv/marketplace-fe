import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense } from "react";
import classes from "./Login.module.css";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className={classes.login_container}>
      <Link href="/" className={classes.back_button}>
        <IconArrowLeft className={classes.back_icon} />
        Back to home
      </Link>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
