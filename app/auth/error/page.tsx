"use client";

import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    let message = "Authentication failed";
    
    switch (error) {
      case "AccessDenied":
        message = "Sign in was denied. Please try again with the correct account.";
        break;
      case "Verification":
        message = "The verification failed. Please try again.";
        break;
      default:
        message = "An error occurred during authentication.";
    }

    toast.error(message);
    redirect("/signin");
  }, [error]);

  return null;
}