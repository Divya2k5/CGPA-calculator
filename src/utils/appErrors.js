const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";
export const FIREBASE_SETUP_MESSAGE =
  "App configuration is incomplete. Add the required public Firebase variables before deploying.";

const ERROR_CODE_MESSAGES = {
  "auth/email-already-in-use": "That email address is already registered.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/missing-password": "Enter your password.",
  "auth/network-request-failed": "A network connection is required to continue.",
  "auth/popup-blocked": "Allow pop-ups in your browser to continue with Google sign-in.",
  "auth/popup-closed-by-user": "Google sign-in was cancelled before completion.",
  "auth/too-many-requests": "Too many attempts were made. Please wait and try again.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/weak-password": "Use a password with at least 6 characters.",
  unavailable: "The service is temporarily unavailable. Please try again shortly.",
  "permission-denied": "You do not have permission to perform that action.",
};

export function toAppErrorMessage(error, fallback = GENERIC_ERROR_MESSAGE) {
  if (!error) {
    return fallback;
  }

  if (error.message === FIREBASE_SETUP_MESSAGE) {
    return FIREBASE_SETUP_MESSAGE;
  }

  if (typeof error.code === "string" && ERROR_CODE_MESSAGES[error.code]) {
    return ERROR_CODE_MESSAGES[error.code];
  }

  if (typeof error.message === "string" && error.message.trim()) {
    if (error.message.length <= 120 && !/api[_ -]?key|token|secret|password/i.test(error.message)) {
      return error.message;
    }
  }

  return fallback;
}
