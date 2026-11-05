import type { Metadata } from "next";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "SmartFares Hub";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms governing your use of ${siteName}.`,
};

export default function TermsOfUsePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-ink">Terms of Use</h1>
      <p className="mt-2 text-sm text-ink-muted">Last updated {new Date().toLocaleDateString()}</p>

      <div className="prose prose-slate mt-6 max-w-none">
        <h2>Use of this site</h2>
        <p>
          {siteName} provides coupon codes and deal information for informational purposes. We
          make a reasonable effort to verify offers but cannot guarantee a code will work at the
          time you use it, as retailers can change or end promotions at any time without notice.
        </p>

        <h2>Third-party links</h2>
        <p>
          This site links to third-party retailer websites. We are not responsible for the
          content, pricing, or policies of those sites. Your purchases are a contract between you
          and the retailer, not {siteName}.
        </p>

        <h2>Affiliate links</h2>
        <p>
          Some links on this site are affiliate links, meaning we may earn a commission at no
          extra cost to you if you make a purchase after clicking through.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          {siteName} is provided &quot;as is&quot; without warranties of any kind. We are not
          liable for any loss arising from your use of this site or any linked third-party site.
        </p>
      </div>
    </div>
  );
}
