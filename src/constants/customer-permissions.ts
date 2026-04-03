/** Customer permission definitions — single source of truth */
export const CUSTOMER_PERMISSIONS = [
  { key: "survey:view", label: "Xem khảo sát", category: "Khảo sát" },
  { key: "survey:submit", label: "Gửi khảo sát", category: "Khảo sát" },
  { key: "support:create", label: "Tạo yêu cầu hỗ trợ", category: "Hỗ trợ kỹ thuật" },
  { key: "support:view", label: "Xem yêu cầu hỗ trợ", category: "Hỗ trợ kỹ thuật" },
  { key: "support:cancel", label: "Hủy yêu cầu hỗ trợ", category: "Hỗ trợ kỹ thuật" },
] as const;

/** All customer permissions including management — for edit dialog */
export const ALL_CUSTOMER_PERMISSIONS = [
  ...CUSTOMER_PERMISSIONS,
  { key: "org:manage_members", label: "Quản lý thành viên", category: "Quản lý" },
] as const;

export const PERMISSION_LABELS: Record<string, string> = {
  ...Object.fromEntries(CUSTOMER_PERMISSIONS.map((p) => [p.key, p.label])),
  "org:manage_members": "Quản lý thành viên",
};

/** Group permissions by category for display */
export const PERMISSION_CATEGORIES: { label: string; keys: string[] }[] = [
  { label: "Khảo sát", keys: ["survey:view", "survey:submit"] },
  { label: "Hỗ trợ kỹ thuật", keys: ["support:create", "support:view", "support:cancel"] },
  { label: "Quản lý", keys: ["org:manage_members"] },
];
