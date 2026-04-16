import { HomeClient } from "@/components/home-client";
import { getApiBase } from "@/lib/api";

export default async function HomePage() {
  let ads: { id: string; titleAr: string; linkUrl: string; imageUrl?: string }[] =
    [];
  try {
    const res = await fetch(`${getApiBase()}/ads`, { next: { revalidate: 30 } });
    if (res.ok) ads = await res.json();
  } catch {
    ads = [];
  }

  return <HomeClient initialAds={ads} />;
}
