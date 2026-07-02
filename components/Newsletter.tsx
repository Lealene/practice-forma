"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section id="journal" className="bg-background py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-32">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-serif text-foreground mb-4">
          Stay in the loop
        </h2>

        <p className="text-muted leading-7 mb-2">
          New pieces, restocks, and the occasional studio note.
        </p>

        <p className="text-gray-500 text-sm mb-8">
          One email a month. No noise, no dark patterns, easy to leave.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col xs:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="flex-1 bg-white border border-cream-border text-foreground placeholder-gray-400 px-4 py-3 rounded-sm focus:outline-none focus:border-green-deep transition w-full"
          />

          <button
            type="submit"
            className={`btn-press px-6 py-3 text-sm tracking-wide rounded-sm w-full xs:w-auto ${
              submitted
                ? "bg-green-mid text-white"
                : "bg-green-deep text-white hover:bg-green-hover"
            }`}
          >
            {submitted ? "Subscribed ✓" : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
