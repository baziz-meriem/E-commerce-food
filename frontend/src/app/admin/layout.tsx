import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const links = [
    { href: "/admin", label: "نظرة عامة" },
    { href: "/admin/orders", label: "الطلبات" },
    { href: "/admin/products", label: "المنتجات" },
    { href: "/admin/branches", label: "الفروع" },
    { href: "/admin/ads", label: "الإعلانات" },
    { href: "/admin/users", label: "المستخدمون" },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-zinc-200 bg-zinc-50 p-4 md:w-56 md:border-b-0 md:border-e">
        <p className="mb-4 font-semibold text-emerald-800">
          لوحة التحكم
        </p>
        <nav className="flex flex-wrap gap-2 md:flex-col md:gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-white hover:shadow"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="mt-8 block text-sm text-zinc-500 hover:text-emerald-700"
        >
          ← المتجر
        </Link>
      </aside>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
