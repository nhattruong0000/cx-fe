"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "./status-badge";
import { ActivityTimeline } from "./activity-timeline";
import {
  useSupportDetail,
  useTechnicians,
  useAssignRequest,
  useUpdateSupportStatus,
} from "@/hooks/use-support-requests";
import { usePermissions } from "@/hooks/use-permissions";
import { formatDate } from "@/lib/utils";

interface ScheduleDetailViewProps {
  requestId: number;
}

export function ScheduleDetailView({ requestId }: ScheduleDetailViewProps) {
  const { data: request, isLoading } = useSupportDetail(requestId);
  const { data: technicians } = useTechnicians();
  const assignMut = useAssignRequest();
  const statusMut = useUpdateSupportStatus();
  const { can } = usePermissions();

  const [techId, setTechId] = useState("");
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");
  const [note, setNote] = useState("");
  const [resultNote, setResultNote] = useState("");

  if (isLoading || !request) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const handleAssign = async () => {
    if (!techId || !schedDate) {
      toast.error("Chọn KTV và ngày hẹn");
      return;
    }
    try {
      await assignMut.mutateAsync({
        id: requestId,
        data: {
          technician_id: Number(techId),
          scheduled_date: schedDate,
          scheduled_time: schedTime || undefined,
          internal_note: note || undefined,
        },
      });
      toast.success("Phân công thành công");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Phân công thất bại");
    }
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      await statusMut.mutateAsync({
        id: requestId,
        data: { new_status: status, result_note: resultNote || undefined },
      });
      toast.success("Cập nhật trạng thái thành công");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Cập nhật thất bại");
    }
  };

  return (
    <div className="space-y-6">
      {/* Request Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{request.issue_summary}</CardTitle>
            <StatusBadge status={request.status} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <div><span className="text-muted-foreground">Khách hàng:</span> {request.customer_name}</div>
          <div><span className="text-muted-foreground">Tổ chức:</span> {request.organization_name}</div>
          <div><span className="text-muted-foreground">SDT:</span> {request.phone}</div>
          <div><span className="text-muted-foreground">Liên hệ:</span> {request.contact_name}</div>
          <div><span className="text-muted-foreground">Ngày mong muốn:</span> {request.preferred_date ? formatDate(request.preferred_date) : "-"}</div>
          <div><span className="text-muted-foreground">Ngày hẹn:</span> {request.scheduled_date ? formatDate(request.scheduled_date) : "-"}</div>
          <div className="sm:col-span-2"><span className="text-muted-foreground">Mô tả:</span> {request.description}</div>
          {request.result_note && (
            <div className="sm:col-span-2"><span className="text-muted-foreground">Kết quả:</span> {request.result_note}</div>
          )}
        </CardContent>
      </Card>

      {/* Assign Form (support:manage, only pending) */}
      {can("support:manage") && request.status === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Phân công kỹ thuật viên</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Kỹ thuật viên</Label>
                <Select value={techId} onValueChange={(v) => { if (v) setTechId(v); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn KTV" />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians?.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ngày hẹn</Label>
                <Input type="date" value={schedDate} onChange={(e) => setSchedDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Giờ hẹn</Label>
                <Input type="time" value={schedTime} onChange={(e) => setSchedTime(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ghi chú nội bộ</Label>
              <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <Button onClick={handleAssign} disabled={assignMut.isPending}>
              {assignMut.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Phân công
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Status Update (support:update, scheduled/in_progress) */}
      {can("support:update") && (request.status === "scheduled" || request.status === "in_progress") && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cập nhật trạng thái</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {request.status === "in_progress" && (
              <div className="space-y-2">
                <Label>Ghi chú kết quả</Label>
                <Textarea rows={2} value={resultNote} onChange={(e) => setResultNote(e.target.value)} />
              </div>
            )}
            <div className="flex gap-2">
              {request.status === "scheduled" && (
                <Button onClick={() => handleStatusUpdate("in_progress")} disabled={statusMut.isPending}>
                  Bắt đầu thực hiện
                </Button>
              )}
              {request.status === "in_progress" && (
                <Button onClick={() => handleStatusUpdate("completed")} disabled={statusMut.isPending}>
                  Hoàn thành
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lịch sử hoạt động</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityTimeline activities={request.activity_log} />
        </CardContent>
      </Card>
    </div>
  );
}
