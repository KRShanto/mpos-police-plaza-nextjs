"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmployeeModal } from "./employee-modal";

interface EmployeeClientPageProps {
  employees: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      age: number | null;
    };
    salary: number;
    workSchedule: string;
  }[];
}

export default function EmployeeClientPage({
  employees,
}: EmployeeClientPageProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#1C494C]">Employees</h2>
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-fg-primary text-white font-semibold px-6 py-2 rounded-md shadow"
        >
          Add Employee
        </Button>
      </div>
      <EmployeeModal open={modalOpen} onOpenChange={setModalOpen} />
      {!employees || employees.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh]">
          <span className="text-xl font-semibold text-gray-500">
            No Employee Information
          </span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
          <table className="min-w-full bg-fg-secondary">
            <thead>
              <tr className="text-left bg-fg-secondary">
                <th className="px-4 py-3 font-normal">ID</th>
                <th className="px-4 py-3 font-normal">Name</th>
                <th className="px-4 py-3 font-normal">Email</th>
                <th className="px-4 py-3 font-normal">Phone</th>
                <th className="px-4 py-3 font-normal">Age (Year)</th>
                <th className="px-4 py-3 font-normal">Salary (TK)</th>
                <th className="px-4 py-3 font-normal">Working Hour</th>
              </tr>
            </thead>
            <tbody className="bg-[#fcfcee] text-[#1C494C]">
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-100">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp.id.slice(-4)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp.user.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp.user.email}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp.user.phone || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp.user.age ?? "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp.salary.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp.workSchedule}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
