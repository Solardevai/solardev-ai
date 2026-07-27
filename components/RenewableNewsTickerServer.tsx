import RenewableNewsTicker from "@/components/RenewableNewsTicker";
import { getRenewableNews } from "@/lib/renewableNews";

export default async function RenewableNewsTickerServer() {
  const headlines = await getRenewableNews();
  if (!headlines.length) return null;
  return <RenewableNewsTicker headlines={headlines} />;
}
