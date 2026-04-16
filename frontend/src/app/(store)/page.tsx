import { HomeClient } from "@/components/home-client";

const base = () =>
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export default async function HomePage() {
  let ads: { id: string; titleAr: string; linkUrl: string; imageUrl?: string }[] =
    [];
  try {
    const res = await fetch(`${base()}/ads`, { next: { revalidate: 30 } });
    ads = await res.json();
  } catch {
    ads = [];
  }

  return <HomeClient initialAds={ads} />;
}
