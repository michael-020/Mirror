"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "";
  if (error === "CredentialsSignin") {
    errorMessage = "Invalid email or password.";
  } else if (error) {
    errorMessage = "An unexpected error occurred.";
  }

  return (
    <div>
      <h1>Sign In</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <form method="post" action="/api/auth/callback/credentials">
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>

      <hr />

      <button onClick={() => signIn("google")}>Continue with Google</button>
    </div>
  );
}
