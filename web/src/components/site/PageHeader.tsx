import type { ReactNode } from "react";
import { Arcs } from "./Decor";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-hair bg-paper">
      <Arcs className="pointer-events-none absolute right-[-10rem] top-[-12rem] h-[34rem] w-[34rem] opacity-60 md:right-[-6rem] md:opacity-90" />
      <div className="container-x relative py-16 md:py-20">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-5 text-4xl md:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-body">{subtitle}</p>
        )}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}
