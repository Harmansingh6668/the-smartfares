import type { Metadata } from "next";
import { Search, MousePointerClick, Copy, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Three simple steps to save with verified coupons and deals.",
};

const steps = [
  {
    icon: Search,
    title: "Find a coupon",
    body: "Search or browse by store and category to find a verified offer.",
  },
  {
    icon: MousePointerClick,
    title: "Reveal the code",
    body: "Tap \"Get Code\" to securely reveal the code and open the store in a new tab.",
  },
  {
    icon: Copy,
    title: "Copy & apply",
    body: "Copy the code and paste it at checkout before you pay.",
  },
  {
    icon: ShoppingBag,
    title: "Save instantly",
    body: "Your discount is applied — no account or sign-up required.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-center text-3xl font-extrabold text-ink">How It Works</h1>
      <p className="mt-2 text-center text-ink-muted">Four steps, no sign-up required.</p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.title} className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
              <step.icon className="h-6 w-6" />
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-primary">
              Step {i + 1}
            </p>
            <h2 className="mt-1 font-bold text-ink">{step.title}</h2>
            <p className="mt-1 text-sm text-ink-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
