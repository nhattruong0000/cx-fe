"use client";

import { useState, useEffect } from "react";
import type { Conversation, TicketStatus } from "@/types/chat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConversationItem } from "./conversation-item";
import { AgentStatusToggle } from "./agent-status-toggle";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

type FilterTab = "all" | TicketStatus;

const tabs: { value: FilterTab; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "open", label: "Mở" },
  { value: "assigned", label: "Đã giao" },
  { value: "resolved", label: "Đã giải quyết" },
];

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onFilterChange: (filter: { status?: FilterTab; search?: string }) => void;
}

export function ConversationList({ conversations, activeId, onSelect, onFilterChange }: ConversationListProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    onFilterChange({ status: tab, search: debouncedSearch });
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  useEffect(() => {
    onFilterChange({ status: activeTab, search: debouncedSearch });
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-full flex-col border-r">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-base font-semibold">Hộp thư</h2>
        <AgentStatusToggle />
      </div>

      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm hội thoại..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      <div className="flex gap-1 border-b px-3 pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            variant="ghost"
            size="sm"
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              "h-7 px-2.5 text-xs",
              activeTab === tab.value && "bg-primary/10 text-primary",
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-1">
        {conversations.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Không có hội thoại</p>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeId}
              onClick={() => onSelect(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
