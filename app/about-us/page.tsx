import type { Metadata } from "next";
import Image from "next/image";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "SmartFares Hub";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${siteName}'s mission to find and verify real coupons and deals.`,
};

export default function AboutUsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-ink">About {siteName}</h1>

      <div className="relative mt-6 h-56 w-full overflow-hidden rounded-2xl sm:h-72">
        <Image
          src="https://images.unsplash.com/photo-1556740749-887f6717d7e4"
          alt="Team collaborating around a laptop"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="prose prose-slate mt-8 max-w-none">
        <p>
          {siteName} was built around a simple idea: coupon sites are full of dead codes, and
          shoppers deserve better. Our editorial team hand-tests every code and deal before it
          goes live, and removes anything that stops working.
        </p>
        <p>
          We partner with hundreds of brands across software, travel, electronics, fashion and
          more, and earn a small commission when you use an offer we list — at no extra cost to
          you. That keeps the site free for everyone, and keeps our incentives aligned with
          finding deals that actually work.
        </p>
        <h2>Our promise</h2>
        <ul>
          <li>Every code is dated so you know when it was last checked.</li>
          <li>Expired codes are automatically flagged and removed.</li>
          <li>No account required, no spam — just savings.</li>
        </ul>
      </div>
    </div>
  );
}
