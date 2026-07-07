import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { signOut } from "@/lib/actions/admin";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/campaigns", label: "Campaigns" },
  { href: "/admin/posts", label: "Blog posts" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="container-x grid gap-8 py-10 md:grid-cols-[210px_1fr]">
      <aside className="md:sticky md:top-24 md:self-start">
        <span className="eyebrow">Admin</span>
        <nav className="mt-4 flex flex-col gap-1">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-body hover:bg-ice"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t border-hair pt-4">
          <p className="truncate text-xs text-muted" title={user.email ?? ""}>
            {user.email}
          </p>
          <form action={signOut} className="mt-2">
            <button type="submit" className="text-sm font-semibold text-brand hover:text-mid">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0">{children}</main>
    </div>
  );
}
