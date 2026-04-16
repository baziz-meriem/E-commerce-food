export function formatMoney(n: number | string) {
  const v = typeof n === "string" ? Number(n) : n;
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(v);
}

export const orderStatusAr: Record<string, string> = {
  PENDING: "قيد الانتظار",
  CONFIRMED: "مؤكد",
  PREPARING: "قيد التجهيز",
  READY: "جاهز للاستلام",
  OUT_FOR_DELIVERY: "خارج للتسليم",
  DELIVERED: "تم التسليم",
  CANCELLED: "ملغي",
};
