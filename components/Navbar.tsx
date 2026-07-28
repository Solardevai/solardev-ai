import NavbarClient from "@/components/NavbarClient";
import RenewableNewsTickerServer from "@/components/RenewableNewsTickerServer";
import { isAuthenticationAvailable } from "@/lib/auth-config";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50">
      <RenewableNewsTickerServer />
      <NavbarClient authEnabled={isAuthenticationAvailable()} />
    </div>
  );
}
