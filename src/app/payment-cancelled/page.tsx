import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";

export default function PaymentCancelledPage() {
  return (
    <>
      <Sidebar />
      <main className="payment-result with-sidebar">
        <SearchBar />
        <section className="payment-result__content">
          <p className="payment-result__eyebrow">Checkout cancelled</p>
          <h1 className="payment-result__title">No worries</h1>
          <p className="payment-result__copy">
            Your subscription was not started. You can choose a plan whenever
            you&apos;re ready.
          </p>
          <Link className="payment-result__button" href="/choose-plan">
            Back to plans
          </Link>
        </section>
      </main>
    </>
  );
}
