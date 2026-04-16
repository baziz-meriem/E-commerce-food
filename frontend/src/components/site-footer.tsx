import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-emerald-900/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-emerald-800">طازج</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-600">
            مواد غذائية مختارة، توصيل لحد البيت، ودفع عند الاستلام.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-zinc-800">تسوق</span>
            <Link href="/products" className="text-zinc-600 hover:text-emerald-700">
              المنتجات
            </Link>
            <Link href="/cart" className="text-zinc-600 hover:text-emerald-700">
              السلة
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-zinc-800">حسابي</span>
            <Link href="/login" className="text-zinc-600 hover:text-emerald-700">
              دخول
            </Link>
            <Link
              href="/account/orders"
              className="text-zinc-600 hover:text-emerald-700"
            >
              طلباتي
            </Link>
            <Link
              href="/account/loyalty"
              className="text-zinc-600 hover:text-emerald-700"
            >
              النقاط
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-100 py-4 text-center text-xs text-zinc-500">
        واجهة تجريبية — صور المنتجات للعرض فقط (Unsplash).
      </div>
    </footer>
  );
}
