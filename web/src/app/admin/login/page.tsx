import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Already signed in? Skip straight to the dashboard.
  const user = await getAdminUser();
  if (user) redirect("/admin");

  return (
    <section className="container-x flex min-h-[80vh] items-center justify-center py-16">
      <LoginForm />
    </section>
  );
}
