"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmployeeModal } from "./employee-modal";

export type EmployeeType = {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  imageUrl: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  address: string | null;
  phone: string | null;
  age: number | null;
  dateOfHire: Date;
  jobTitle: string;
  workSchedule: string;
  salary: number;
};

interface EmployeeClientPageProps {
  employees: EmployeeType[];
}

export default function EmployeeClientPage({
  employees,
}: EmployeeClientPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit">(
    "create"
  );
  const [selectedEmployee, setSelectedEmployee] = useState<
    EmployeeType | undefined
  >(undefined);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Employees</h2>
        <Button
          onClick={() => {
            setModalMode("create");
            setSelectedEmployee(undefined);
            setModalOpen(true);
          }}
          className="bg-fg-primary text-white font-semibold px-6 py-2 rounded-md shadow"
        >
          Add Employee
        </Button>
      </div>
      <EmployeeModal
        mode={modalMode}
        open={modalOpen}
        onOpenChange={setModalOpen}
        employee={modalMode === "create" ? undefined : selectedEmployee}
        onInitiateEdit={() => setModalMode("edit")}
        onDelete={() => {
          setModalOpen(false);
        }}
      />
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
            <tbody className="bg-bg-secondary">
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b border-gray-100 cursor-pointer hover:bg-[#e8f2ef]"
                  onClick={() => {
                    setSelectedEmployee(emp);
                    setModalMode("view");
                    setModalOpen(true);
                  }}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp.employeeId}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{emp.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{emp.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp.phone || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp.age ?? "-"}
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
