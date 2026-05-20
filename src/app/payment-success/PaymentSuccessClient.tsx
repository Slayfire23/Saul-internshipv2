"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { SUBSCRIPTION_KEY, LocalSubscription } from "@/lib/subscription";

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const plan = searchParams.get("plan");
    const subscription: LocalSubscription = {
      active: true,
      plan: plan === "monthly" || plan === "yearly" ? plan : "unknown",
      startedAt: new Date().toISOString(),
    };

    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
  }, [searchParams]);

  return (
    <>
      <Sidebar />
      <main className="payment-result with-sidebar">
        <SearchBar />
        <section className="payment-result__content">
          <p className="payment-result__eyebrow">Checkout complete</p>
          <h1 className="payment-result__title">You&apos;re all set</h1>
          <p className="payment-result__copy">
            Your test subscription was created successfully. Premium access is now
            enabled on this browser.
          </p>
          <Link className="payment-result__button" href="/for-you">
            Continue to For You
          </Link>
        </section>
      </main>
    </>
  );
}
