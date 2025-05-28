import { ProfileSettings } from "./profile/profile";
import { BusinessSettings } from "./business/business";
import { TaxSettings } from "./tax/tax";
import { DiscountSettings } from "./discount/discount";
import { LoyaltySettings } from "./loyalty/loyalty";
import { ReceiptSettings } from "./receipt/receipt";
import { BalanceSettings } from "./balance/balance";
import { PersonalizationSettings } from "./personalization/personalization";
import { ChangePasswordSettings } from "./change-password/change-password";

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
          <ChangePasswordSettings />
        </div>
      </div>
    </div>
  );
}
