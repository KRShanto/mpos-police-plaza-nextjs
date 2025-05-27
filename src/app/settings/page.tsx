import { ProfileSettings } from "./profile/profile";
import { BusinessSettings } from "./business/business";
import { TaxSettings } from "./tax/tax";
import { DiscountSettings } from "./discount/discount";
import { LoyaltySettings } from "./loyalty/loyalty";
import { ReceiptSettings } from "./receipt/receipt";
import { BalanceSettings } from "./balance/balance";
import { PersonalizationSettings } from "./personalization/personalization";
import Link from "next/link";

export default async function Settings() {
  return (
    <div className="p-6 min-h-screen">
      <div className="w-full px-4">
        <div className="grid grid-cols-4 gap-6 w-full">
          <ProfileSettings />
          <BusinessSettings />
          <TaxSettings />
          <DiscountSettings />
          <LoyaltySettings />
          <ReceiptSettings />
          <BalanceSettings />
          <PersonalizationSettings />
          <Link href="/settings/change-password">
            <div className="w-full bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center justify-center">
              <div className="text-4xl mb-3">🔑</div>
              <h2 className="text-sm font-semibold text-gray-800 text-center">
                Change Password
              </h2>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
