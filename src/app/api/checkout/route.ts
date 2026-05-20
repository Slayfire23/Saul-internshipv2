import { NextResponse } from "next/server";

type CheckoutPlan = "monthly" | "yearly";

const plans = {
  monthly: {
    name: "Summarist Premium Monthly",
    amount: 999,
    interval: "month",
    trialPeriodDays: undefined,
  },
  yearly: {
    name: "Summarist Premium Yearly",
    amount: 7999,
    interval: "year",
    trialPeriodDays: 7,
  },
} satisfies Record<
  CheckoutPlan,
  {
    name: string;
    amount: number;
    interval: "month" | "year";
    trialPeriodDays?: number;
  }
>;

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured yet. Add STRIPE_SECRET_KEY to .env.local.",
      },
      { status: 500 }
    );
  }

  const { plan } = (await request.json()) as { plan?: CheckoutPlan };

  if (plan !== "monthly" && plan !== "yearly") {
    return NextResponse.json({ error: "Invalid plan selected." }, { status: 400 });
  }

  const selectedPlan = plans[plan];
  const origin = new URL(request.url).origin;
  const params = new URLSearchParams({
    mode: "subscription",
    success_url: `${origin}/payment-success?plan=${plan}`,
    cancel_url: `${origin}/payment-cancelled`,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(selectedPlan.amount),
    "line_items[0][price_data][product_data][name]": selectedPlan.name,
    "line_items[0][price_data][recurring][interval]": selectedPlan.interval,
  });

  if (selectedPlan.trialPeriodDays) {
    params.set(
      "subscription_data[trial_period_days]",
      String(selectedPlan.trialPeriodDays)
    );
  }

  const stripeResponse = await fetch(
    "https://api.stripe.com/v1/checkout/sessions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    }
  );
  const checkoutSession = await stripeResponse.json();

  if (!stripeResponse.ok) {
    return NextResponse.json(
      {
        error:
          checkoutSession.error?.message || "Unable to create checkout session.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: checkoutSession.url });
}
