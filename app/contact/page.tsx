import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-ink">Contact Us</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Spotted a dead code, want a store added, or just have feedback? Send us a message.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
