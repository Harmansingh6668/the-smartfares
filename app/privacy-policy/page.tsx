import type { Metadata } from "next";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "SmartFares Hub";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteName} collects, uses and protects your data.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-ink">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink-muted">Last updated {new Date().toLocaleDateString()}</p>

      <div className="prose prose-slate mt-6 max-w-none">
        <h2>What we collect</h2>
        <p>
          When you reveal a coupon code, we log an anonymous, one-way hashed version of your IP
          address and browser user agent — never the raw values — purely to detect abuse and
          measure which offers are useful. This data cannot be used to identify you.
        </p>
        <p>
          If you submit our contact form, we store the name, email and message you provide so we
          can reply to you.
        </p>

        <h2>Affiliate relationships</h2>
        <p>
          {siteName} earns a commission when you click through to a store and make a qualifying
          purchase. This never affects the price you pay, and does not influence which offers we
          choose to list.
        </p>

        <h2>Cookies</h2>
        <p>
          We use strictly necessary cookies for site functionality (such as keeping you signed in
          to the admin dashboard). We do not run third-party advertising trackers without your
          consent.
        </p>

        <h2>Your rights</h2>
        <p>
          You can request access to or deletion of any personal data we hold about you by
          contacting us through our <a href="/contact">contact page</a>.
        </p>
      </div>
    </div>
  );
}
