"use client";

import { useState } from "react";
import type { SurveyResponse } from "@/types/survey";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SurveyResponseListProps {
  responses: SurveyResponse[];
}

export function SurveyResponseList({ responses }: SurveyResponseListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Phản hồi ({responses.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Điểm</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((r) => (
                <ResponseRow
                  key={r.id}
                  response={r}
                  expanded={expandedId === r.id}
                  onToggle={() => toggle(r.id)}
                />
              ))}
              {responses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Chưa có phản hồi
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

interface ResponseRowProps {
  response: SurveyResponse;
  expanded: boolean;
  onToggle: () => void;
}

function ResponseRow({ response, expanded, onToggle }: ResponseRowProps) {
  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{response.customerName}</TableCell>
        <TableCell>{response.score}</TableCell>
        <TableCell>{formatDate(response.createdAt)}</TableCell>
        <TableCell>
          {response.comment && (
            <Button variant="ghost" size="sm" onClick={onToggle}>
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </TableCell>
      </TableRow>
      {expanded && response.comment && (
        <TableRow>
          <TableCell colSpan={4} className="bg-muted/50">
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(response.comment) }}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
