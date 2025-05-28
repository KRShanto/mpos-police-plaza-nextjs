"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Customer, CustomerFeedback } from "@/generated/prisma";
import { MessageSquarePlus, Plus, Search } from "lucide-react";
import { useState } from "react";
import { AddCustomerDialog } from "./add-customer-dialog";
import { AddFeedbackDialog } from "./add-feedback-dialog";

interface CustomerTableProps {
  customers: Customer[];
  feedbacks: CustomerFeedback[];
}

export function CustomerTable({
  customers: initialCustomers,
}: CustomerTableProps) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [addFeedbackOpen, setAddFeedbackOpen] = useState(false);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setAddCustomerOpen(true)}
              className="bg-fg-primary hover:bg-fg-secondary flex items-center gap-2"
            >
              <Plus className="h-5 w-5" /> Add Customer
            </Button>
            <Button
              onClick={() => setAddFeedbackOpen(true)}
              className="bg-fg-primary hover:bg-fg-secondary flex items-center gap-2"
            >
              <MessageSquarePlus className="h-5 w-5" /> Add Feedback
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-6 gap-4 p-4 bg-fg-secondary text-gray-800 font-medium">
            <div>No.</div>
            <div>Name</div>
            <div>Phone Number</div>
            <div>Total Spent (TK)</div>
            <div>Due Balance (TK)</div>
            <div>Loyalty Points</div>
          </div>

          <div className="divide-y">
            {filteredCustomers.map((customer, index) => (
              <div
                key={customer.id}
                className="grid grid-cols-6 gap-4 p-4 hover:bg-gray-50"
              >
                <div>{index + 1}</div>
                <div>{customer.name}</div>
                <div>{customer.phone}</div>
                <div>{customer.totalSpent}</div>
                <div>{customer.due}</div>
                <div>{customer.loyaltyPoints}</div>
              </div>
            ))}

            {filteredCustomers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No customers found
              </div>
            )}
          </div>
        </div>
      </div>

      <AddCustomerDialog
        open={addCustomerOpen}
        onOpenChange={setAddCustomerOpen}
        onSuccess={(newCustomer) => {
          setCustomers((prev) => [newCustomer, ...prev]);
        }}
      />

      <AddFeedbackDialog
        open={addFeedbackOpen}
        onOpenChange={setAddFeedbackOpen}
      />
    </>
  );
}
