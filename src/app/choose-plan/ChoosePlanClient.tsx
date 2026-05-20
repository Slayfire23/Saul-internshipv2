"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiCheck,
  FiChevronDown,
  FiCreditCard,
  FiHeadphones,
  FiZap,
} from "react-icons/fi";

type PlanId = "monthly" | "yearly";

const plans = {
  monthly: {
    id: "monthly" as const,
    label: "Monthly",
    price: "$9.99",
    cadence: "month",
    note: "Flexible access. Cancel whenever you want.",
    cta: "Start monthly plan",
  },
  yearly: {
    id: "yearly" as const,
    label: "Yearly",
    price: "$79.99",
    cadence: "year",
    note: "7-day free trial, then billed annually.",
    cta: "Start 7-day free trial",
  },
};

const features = [
  "Unlimited access to premium book summaries",
  "Listen or read across all available titles",
  "Save books to My Library",
  "New recommendations added regularly",
];

const faqs = [
  {
    question: "Can I switch plans later?",
    answer:
      "Yes. Once billing is connected, users will be able to manage plan changes from their account billing settings.",
  },
  {
    question: "How does the 7-day trial work?",
    answer:
      "The yearly plan starts with a 7-day free trial. Stripe collects payment details and begins annual billing after the trial ends.",
  },
  {
    question: "Can I cancel any time?",
    answer:
      "Yes. Subscriptions are intended to be cancellable from the billing portal once account billing management is added.",
  },
  {
    question: "What do I get with premium?",
    answer:
      "Premium unlocks paid summaries, audio playback, and access to the full Summarist reading experience.",
  },
];

export default function ChoosePlanClient() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("yearly");
  const [openFaq, setOpenFaq] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [message, setMessage] = useState("");
  const plan = plans[selectedPlan];

  async function handleCheckout() {
    setIsCheckingOut(true);
    setMessage("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout is not available right now.");
      }

      window.location.href = data.url;
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Checkout is not available right now."
      );
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <main className="choose-plan">
      <div className="choose-plan__shell">
        <header className="choose-plan__header">
          <Link className="choose-plan__logo" href="/for-you">
            Summarist
          </Link>
          <Link className="choose-plan__back" href="/for-you">
            Back to For You
          </Link>
        </header>

        <section className="choose-plan__hero">
          <div className="choose-plan__hero-copy">
            <p className="choose-plan__eyebrow">Unlock premium</p>
            <h1 className="choose-plan__title">
              Get more knowledge in less time
            </h1>
            <p className="choose-plan__copy">
              Read and listen to premium summaries built for busy people who
              want useful ideas without the long wait.
            </p>
            <div className="choose-plan__highlights">
              <span>
                <FiZap />
                Fast summaries
              </span>
              <span>
                <FiHeadphones />
                Audio included
              </span>
              <span>
                <FiCreditCard />
                Secure checkout
              </span>
            </div>
          </div>

          <div className="choose-plan__panel">
            <div className="choose-plan__toggle" aria-label="Billing period">
              <button
                className={`choose-plan__toggle-button ${
                  selectedPlan === "monthly"
                    ? "choose-plan__toggle-button--active"
                    : ""
                }`}
                onClick={() => setSelectedPlan("monthly")}
                type="button"
              >
                Monthly
              </button>
              <button
                className={`choose-plan__toggle-button ${
                  selectedPlan === "yearly"
                    ? "choose-plan__toggle-button--active"
                    : ""
                }`}
                onClick={() => setSelectedPlan("yearly")}
                type="button"
              >
                Yearly
              </button>
            </div>

            <div className="choose-plan__price-card">
              {selectedPlan === "yearly" && (
                <span className="choose-plan__badge">7-day free trial</span>
              )}
              <h2 className="choose-plan__plan-name">{plan.label}</h2>
              <div className="choose-plan__price">
                <span>{plan.price}</span>
                <small>/{plan.cadence}</small>
              </div>
              <p className="choose-plan__plan-note">{plan.note}</p>

              <ul className="choose-plan__features">
                {features.map((feature) => (
                  <li key={feature}>
                    <FiCheck />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className="choose-plan__button"
                disabled={isCheckingOut}
                onClick={handleCheckout}
                type="button"
              >
                {isCheckingOut ? "Opening checkout..." : plan.cta}
              </button>
              {message && <p className="choose-plan__message">{message}</p>}
            </div>
          </div>
        </section>

        <section className="choose-plan__faq-section">
          <h2 className="choose-plan__section-title">Questions</h2>
          <div className="choose-plan__accordion">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div className="choose-plan__faq" key={faq.question}>
                  <button
                    className="choose-plan__faq-button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    type="button"
                  >
                    <span>{faq.question}</span>
                    <FiChevronDown
                      className={isOpen ? "choose-plan__faq-icon--open" : ""}
                    />
                  </button>
                  {isOpen && <p className="choose-plan__faq-answer">{faq.answer}</p>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
