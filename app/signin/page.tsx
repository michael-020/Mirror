"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter, redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { PasswordInput } from "@/components/PasswordInput";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [clientError, setClientError] = useState<string>("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const { data: session } = useSession()

  useEffect(() => {
    if(session)
      redirect("/home")
  }, [session])
 
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const decodedCallbackUrl = decodeURIComponent(callbackUrl);

  let errorMessage = "";
  if (clientError) {
    errorMessage = clientError;
  } else if (error === "CredentialsSignin") {
    errorMessage = "Invalid email or password.";
  } else if (error === "OAuthSignin") {
    errorMessage = "Error with OAuth provider. Please try again.";
  } else if (error === "OAuthCallback") {
    errorMessage = "Error in OAuth callback. Please try again.";
  } else if (error === "OAuthCreateAccount") {
    errorMessage = "Could not create OAuth account. Please try again.";
  } else if (error === "EmailCreateAccount") {
    errorMessage = "Could not create account with that email address.";
  } else if (error === "Callback") {
    errorMessage = "Error in callback. Please try again.";
  } else if (error === "OAuthAccountNotLinked") {
    errorMessage = "Account not linked. Please use the same method you used to sign up.";
  } else if (error === "EmailSignin") {
    errorMessage = "Check your email for the sign in link.";
  } else if (error === "CredentialsSignup") {
    errorMessage = "Error creating account. Please try again.";
  } else if (error === "SessionRequired") {
    errorMessage = "Please sign in to access this page.";
  } else if (error) {
    errorMessage = `Authentication error: ${error}`;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (clientError) {
      setClientError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setClientError(""); // Clear any previous errors

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl: decodedCallbackUrl
      });

      if (result?.error) {
        console.error("Sign in error:", result.error);
        // Handle the error client-side
        if (result.error === "CredentialsSignin") {
          setClientError("Invalid email or password.");
        } else {
          setClientError("An error occurred during sign in. Please try again.");
        }
      } else if (result?.ok) {
        router.push(decodedCallbackUrl);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setClientError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: decodedCallbackUrl })}
            disabled={isLoading}
            className="mt-6 w-full space-x-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 border border-gray-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
          >
            <Image alt="google-image" src={"./google.svg"} width={25} height={25} />
            <p>
              Continue with Google
            </p>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/verify-email" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}