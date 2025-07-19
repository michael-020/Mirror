type AuthError = 
  | "CredentialsSignin"
  | "OAuthSignin"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "CredentialsSignup"
  | "SessionRequired"
  | string;

export const getAuthErrorMessage = (error: AuthError): string => {
  switch (error) {
    case "CredentialsSignin":
      return "Invalid email or password.";
    case "OAuthSignin":
      return "Error with OAuth provider. Please try again.";
    case "OAuthCallback":
      return "Error in OAuth callback. Please try again.";
    case "OAuthCreateAccount":
      return "Could not create OAuth account. Please try again.";
    case "EmailCreateAccount":
      return "Could not create account with that email address.";
    case "Callback":
      return "Error in callback. Please try again.";
    case "OAuthAccountNotLinked":
      return "Account not linked. Please use the same method you used to sign up.";
    case "EmailSignin":
      return "Check your email for the sign in link.";
    case "CredentialsSignup":
      return "Error creating account. Please try again.";
    case "SessionRequired":
      return "Please sign in to access this page.";
    default:
      return `Authentication error: ${error}`;
  }
};