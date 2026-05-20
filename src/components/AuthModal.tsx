"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiUser, FiX } from "react-icons/fi";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const SUCCESS_REDIRECT_URL = "/for-you";

export type AuthMode = "login" | "register" | "forgot";

type AuthModalProps = {
  isOpen: boolean;
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
  successRedirectUrl?: string | null;
};

const authContent = {
  login: {
    title: "Log in to Summarist",
    button: "Login",
  },
  register: {
    title: "Create your account",
    button: "Register",
  },
  forgot: {
    title: "Reset your password",
    button: "Send reset link",
  },
};

export default function AuthModal({
  isOpen,
  mode,
  onClose,
  onModeChange,
  successRedirectUrl = SUCCESS_REDIRECT_URL,
}: AuthModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      if (!email.includes("@")) {
        setMessage("Invalid email");
        return;
      }

      if (mode === "register" && password.length < 6) {
        setMessage("Short password");
        return;
      }

      if (mode === "forgot") {
        await sendPasswordResetEmail(auth, email);
        setMessage("Password reset email sent. Check your inbox.");
        return;
      }

      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      setEmail("");
      setPassword("");
      onClose();
      if (successRedirectUrl) {
        router.push(successRedirectUrl);
      }
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGuestLogin() {
    setIsSubmitting(true);
    setMessage("");

    try {
      await signInAnonymously(auth);
      onClose();
      if (successRedirectUrl) {
        router.push(successRedirectUrl);
      }
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setIsSubmitting(true);
    setMessage("");

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
      if (successRedirectUrl) {
        router.push(successRedirectUrl);
      }
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-modal__overlay" role="presentation" onMouseDown={onClose}>
      <div
        aria-modal="true"
        className="auth-modal"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Close authentication modal"
          className="auth-modal__close"
          onClick={onClose}
          type="button"
        >
          <FiX />
        </button>

        <div className="auth-modal__content">
          <h2 className="auth-modal__title">{authContent[mode].title}</h2>

          {mode !== "forgot" && (
            <>
              <div className="auth-modal__providers">
                <button
                  className="btn auth-modal__provider auth-modal__provider--guest"
                  disabled={isSubmitting}
                  onClick={handleGuestLogin}
                  type="button"
                >
                  <span className="auth-modal__provider-icon auth-modal__provider-icon--guest">
                    <FiUser />
                  </span>
                  Login as a Guest
                </button>

                <div className="auth-modal__separator auth-modal__separator--compact">
                  <span>or</span>
                </div>

                <button
                  className="btn auth-modal__provider auth-modal__provider--google"
                  disabled={isSubmitting}
                  onClick={handleGoogleLogin}
                  type="button"
                >
                  <span className="auth-modal__provider-icon auth-modal__provider-icon--google">
                    <Image
                      alt="Google"
                      height={24}
                      src="/assets/google.png"
                      width={24}
                    />
                  </span>
                  Login with Google
                </button>
              </div>

              <div className="auth-modal__separator">
                <span>or</span>
              </div>
            </>
          )}

          <form className="auth-modal__form" onSubmit={handleSubmit}>
            <input
              className="auth-modal__input"
              disabled={isSubmitting}
              id="auth-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email Address"
              required
              type="email"
              value={email}
            />

            {mode !== "forgot" && (
              <input
                className="auth-modal__input"
                disabled={isSubmitting}
                id="auth-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                required
                minLength={6}
                type="password"
                value={password}
              />
            )}

            <button
              disabled={isSubmitting}
              className="auth-modal__submit"
              type="submit"
            >
              {isSubmitting ? "Please wait..." : authContent[mode].button}
            </button>
          </form>

          {message && <p className="auth-modal__message">{message}</p>}

          {mode === "login" && (
            <button
              className="auth-modal__link"
              onClick={() => onModeChange("forgot")}
              type="button"
            >
              Forgot your password?
            </button>
          )}
        </div>

        <div className="auth-modal__switch">
          {mode === "register" ? (
            <button
              className="auth-modal__switch-button"
              onClick={() => onModeChange("login")}
              type="button"
            >
              Already have an account?
            </button>
          ) : (
            <button
              className="auth-modal__switch-button"
              onClick={() => onModeChange("register")}
              type="button"
            >
              Don&apos;t have an account?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function getAuthErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "That email is already registered. Try logging in instead.";
      case "auth/invalid-email":
        return "Invalid email";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "User not found";
      case "auth/weak-password":
        return "Short password";
      case "auth/popup-closed-by-user":
        return "Google login was closed before it finished.";
      case "auth/operation-not-allowed":
        return "This sign-in method is not enabled in Firebase yet.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  return "Something went wrong. Please try again.";
}
