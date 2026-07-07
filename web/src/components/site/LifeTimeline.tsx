"use client";

import { useEffect, useRef } from "react";
import { site, waLink } from "@/lib/site";

/* The signature element: insurance taught as a sequence of real life chapters. */
const chapters = [
  {
    n: "01",
    stage: "Starting out",
    focus: "Your income & your health",
    note: "A hospital stay shouldn't wipe out your savings.",
    tags: ["Medical card", "Personal accident"],
  },
  {
    n: "02",
    stage: "Building a family",
    focus: "Their future, even if you're not here",
    note: "Cover that replaces your income for the people who rely on it.",
    tags: ["Life", "Critical illness"],
  },
  {
    n: "03",
    stage: "Home & commitments",
    focus: "The mortgage and everyone under that roof",
    note: "Keep the home steady through life's curveballs.",
    tags: ["Mortgage cover", "Term life"],
  },
  {
    n: "04",
    stage: "Growing wealth",
    focus: "Money that works while you do",
    note: "Save and invest with protection built in.",
    tags: ["Savings", "Investment-linked"],
  },
  {
    n: "05",
    stage: "Retiring well",
    focus: "Income that outlives your salary",
    note: "Plan now for a comfortable, independent retirement.",
    tags: ["Retirement", "Legacy"],
  },
];

export function LifeTimeline() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="timeline" className="bg-white py-20 md:py-28">
      <div className="container-x">
        <div className="max-w-2xl">
          <span className="eyebrow">How cover works</span>
          <h2 className="mt-4 text-3xl md:text-[2.75rem]">
            Protection that grows with your{" "}
            <span className="serif-accent text-gold">life</span>.
          </h2>
          <p className="mt-4 text-lg text-body">
            You don&apos;t buy insurance once. You shape it around each chapter — here&apos;s
            what most people protect, and when.
          </p>
        </div>

        <div ref={ref} className="relative mt-14">
          {/* Connecting spine — vertical on mobile, horizontal on desktop */}
          <div
            aria-hidden
            className="absolute left-[7px] top-1 bottom-1 w-px bg-gradient-to-b from-gold via-hair to-hair md:left-0 md:right-0 md:top-[7px] md:bottom-auto md:h-px md:w-auto md:bg-gradient-to-r"
          />

          <ol className="grid grid-cols-1 gap-9 md:grid-cols-5 md:gap-5">
            {chapters.map((c, i) => (
              <li
                key={c.n}
                className="reveal relative pl-9 md:pl-0"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                {/* Node */}
                <span
                  aria-hidden
                  className="absolute left-[7px] top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-gold ring-4 ring-white md:static md:mb-6 md:block md:translate-x-0"
                />
                <div className="font-display text-4xl font-light text-gold md:mt-0">{c.n}</div>
                <h3 className="mt-2 text-xl">{c.stage}</h3>
                <p className="mt-1 text-sm font-semibold text-brand">{c.focus}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.note}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-hair bg-cloud px-2.5 py-1 text-xs font-medium text-body"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4 rounded-card border border-hair bg-cloud px-6 py-5">
          <p className="text-base text-body">
            <span className="font-semibold text-ink">Not sure which chapter you&apos;re in?</span>{" "}
            That&apos;s exactly what I help with.
          </p>
          <a
            href={waLink(`Hi ${site.name}, can you help me figure out what cover I need?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp ml-auto"
          >
            Ask me on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
