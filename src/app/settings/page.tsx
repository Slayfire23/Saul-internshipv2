"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import AuthModal, { AuthMode } from "@/components/AuthModal";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { SettingsSkeleton } from "@/components/Skeletons";
import { auth } from "@/lib/firebase";
import { LocalSubscription, SUBSCRIPTION_KEY } from "@/lib/subscription";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [subscription, setSubscription] = useState<LocalSubscription>(() =>
    getStoredSubscription()
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      setSubscription(getStoredSubscription());
    });

    return unsubscribe;
  }, []);

  function openAuthModal() {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  }

  const planLabel = getPlanLabel(subscription);

  return (
    <>
      <Sidebar />
      <main className="settings-page with-sidebar">
        <div className="settings-page__shell">
          <SearchBar />

          <section className="settings-page__hero">
            <h1 className="settings-page__title">Settings</h1>
            <p className="settings-page__subtitle">
              Manage your account and subscription.
            </p>
          </section>

          {!isAuthReady && <SettingsSkeleton />}

          {isAuthReady && !user && (
            <section className="settings-page__logged-out">
              <div className="settings-page__image-wrapper">
                <Image
                  className="settings-page__image"
                  src="/assets/login.png"
                  alt="Login to view settings"
                  width={320}
                  height={320}
                  priority
                />
              </div>
              <div className="settings-page__logged-out-content">
                <h2 className="settings-page__section-title">
                  Log in to view your settings
                </h2>
                <p className="settings-page__copy">
                  Sign in to see your email, subscription plan, and account
                  details.
                </p>
                <button
                  className="settings-page__primary"
                  onClick={openAuthModal}
                  type="button"
                >
                  Login
                </button>
              </div>
            </section>
          )}

          {isAuthReady && user && (
            <section className="settings-page__grid">
              <article className="settings-page__card">
                <p className="settings-page__eyebrow">Account</p>
                <h2 className="settings-page__section-title">Email</h2>
                <p className="settings-page__value">
                  {user.email || "Guest user"}
                </p>
              </article>

              <article className="settings-page__card">
                <p className="settings-page__eyebrow">Subscription</p>
                <h2 className="settings-page__section-title">Plan</h2>
                <div className="settings-page__plan-row">
                  <span
                    className={`settings-page__plan settings-page__plan--${planLabel}`}
                  >
                    {formatPlanLabel(planLabel)}
                  </span>
                  {planLabel === "basic" && (
                    <Link className="settings-page__primary" href="/choose-plan">
                      Upgrade
                    </Link>
                  )}
                </div>
              </article>
            </section>
          )}
        </div>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onModeChange={setAuthMode}
        successRedirectUrl={null}
      />
    </>
  );
}

function getStoredSubscription(): LocalSubscription {
  try {
    const storedSubscription = localStorage.getItem(SUBSCRIPTION_KEY);

    if (!storedSubscription) {
      return {
        active: false,
        plan: "unknown",
        startedAt: "",
      };
    }

    return JSON.parse(storedSubscription);
  } catch {
    return {
      active: false,
      plan: "unknown",
      startedAt: "",
    };
  }
}

function getPlanLabel(subscription: LocalSubscription) {
  if (!subscription.active) {
    return "basic";
  }

  if (subscription.plan === "yearly") {
    return "premium-plus";
  }

  return "premium";
}

function formatPlanLabel(plan: string) {
  return plan
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");
}
