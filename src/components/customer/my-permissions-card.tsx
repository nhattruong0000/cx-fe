/** Card displaying the current user's permissions grouped by category */

import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { PERMISSION_LABELS, PERMISSION_CATEGORIES } from "@/constants/customer-permissions";

interface MyPermissionsCardProps {
  permissions: string[];
}

export function MyPermissionsCard({ permissions }: MyPermissionsCardProps) {
  const permissionSet = new Set(permissions);

  // Only render categories that have at least one matching permission
  const activeCategories = PERMISSION_CATEGORIES.filter((cat) =>
    cat.keys.some((k) => permissionSet.has(k))
  );

  return (
    <div className="rounded-[14px] border border-[#E4E4E7] bg-white">
      {/* Card header */}
      <div className="flex items-center gap-2.5 border-b border-[#E4E4E7] px-6 py-4">
        <ShieldCheck size={18} className="text-[#2556C5]" />
        <span className="text-[15px] font-semibold text-[#09090B]">Quyền hạn của tôi</span>
      </div>

      {/* Card body */}
      <div className="p-6">
        {activeCategories.length === 0 ? (
          <p className="text-sm text-[#71717A]">Bạn chưa có quyền hạn nào.</p>
        ) : (
          <div className="flex flex-col">
            {activeCategories.map((category, idx) => {
              const categoryPerms = category.keys.filter((k) => permissionSet.has(k));
              const isLast = idx === activeCategories.length - 1;

              return (
                <div key={category.label}>
                  {/* Category section */}
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#71717A]">
                      {category.label}
                    </span>
                    <div className="flex flex-col gap-2">
                      {categoryPerms.map((perm) => (
                        <div key={perm} className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="shrink-0 text-[#16A34A]" />
                          <span className="text-[13px] text-[#09090B]">
                            {PERMISSION_LABELS[perm] ?? perm}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Separator between categories */}
                  {!isLast && <div className="my-4 h-px w-full bg-[#E4E4E7]" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
