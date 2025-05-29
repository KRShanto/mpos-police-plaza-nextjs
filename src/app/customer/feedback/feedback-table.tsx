"use client";

import { CustomerFeedback } from "@/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { ChevronDown, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackTableProps {
  feedbacks: CustomerFeedback[];
}

export function FeedbackTable({ feedbacks }: FeedbackTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const truncateFeedback = (feedback: string) => {
    return feedback.length > 100 ? feedback.slice(0, 100) + "..." : feedback;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Feedback</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((feedback) => (
            <>
              <TableRow
                key={feedback.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => toggleRow(feedback.id)}
              >
                <TableCell>
                  {expandedRows.has(feedback.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{feedback.name}</TableCell>
                <TableCell>{feedback.phone}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{feedback.rating}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  {truncateFeedback(feedback.feedback)}
                </TableCell>
              </TableRow>
              <TableRow
                className={cn(
                  "bg-muted/50",
                  !expandedRows.has(feedback.id) && "hidden"
                )}
              >
                <TableCell colSpan={5} className="p-4">
                  <div className="text-sm">{feedback.feedback}</div>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
