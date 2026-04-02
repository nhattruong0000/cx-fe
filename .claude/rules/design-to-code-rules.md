# Design-to-Code Rules

## Source of Truth
- Design trong .pen file là SOURCE OF TRUTH
- Code PHẢI được update để khớp design, KHÔNG phải ngược lại
- Khi phát hiện mismatch → sửa code component, KHÔNG sửa design
- **Design System Compliance**: Xem chi tiết tại `design-system-compliance.md` — mọi design PHẢI tuân thủ design system (Node ID: `jFCZd`) và nhất quán với pages đã có

## Design-First Gate (MANDATORY)
- Trước khi implement bất kỳ UI nào, PHẢI kiểm tra design tương ứng có tồn tại trong `cx-fe/design/design-system.pen` không
- Nếu KHÔNG có design sẵn → PHẢI hỏi user trước khi implement. KHÔNG tự ý code UI mà chưa có design
- Chỉ proceed implement khi: (a) design đã có sẵn trong .pen, HOẶC (b) user cho phép implement không cần design

## .pen Design Workflow (Full Pipeline)
Khi thêm/sửa design trong .pen file:
1. **Audit code** — Đọc source code của TẤT CẢ components sẽ dùng trong design
2. **Design** — Tạo design trong .pen, dùng đúng reusable components và variables
3. **Screenshot verify** — Dùng get_screenshot kiểm tra visual output
4. **Liệt kê mismatches** — So sánh .pen specs vs code component specs (padding, fontSize, colors, sizes)
5. **Update code** — Sửa code components cho khớp design specs
6. **Re-verify** — Yêu cầu user verify trên UI thực tế

## .pen File Organization
### Naming Convention
- Frame names PHẢI theo format: `Category / Component Name`
- Ví dụ: `Dialog / View Profile`, `Dialog / Edit Role`, `Admin / User Management`
- Dùng prefix nhất quán theo nhóm: Auth, Account, Admin, Dialog, Component...

### Placement Rules
- LUÔN dùng `find_empty_space_on_canvas` trước khi đặt frame mới
- KHÔNG đặt frame chồng lên frame khác
- Group frames theo category (các Dialog gần nhau, các Admin screens gần nhau)

## Cross-Reference Design Tokens
- Khi implement từ .pen design, PHẢI đọc design component specs (padding, fontSize, colors, cornerRadius) và cross-reference với code component hiện tại TRƯỚC khi sử dụng
- Nếu code component KHÔNG khớp design spec → sửa code component, KHÔNG assume chúng khớp
- Map design tokens sang Tailwind: padding:[2,10] → py-0.5 px-2.5, fontSize:12 → text-xs

## Component Audit First
- Trước khi implement UI từ design, liệt kê TẤT CẢ components sẽ dùng
- Đọc source code của TỪNG component, kiểm tra variants/sizes/colors có khớp design không
- Nếu phát hiện mismatch → sửa component TRƯỚC khi implement feature

## Verify Before Deliver
- SAU KHI implement xong, PHẢI so sánh kết quả với design (.pen screenshot)
- Checklist bắt buộc: sizing, colors, spacing, typography, borders/separators, shadows
- Nếu không thể screenshot → yêu cầu user verify trước khi báo hoàn thành
- KHÔNG báo "done" nếu chưa verify visual output
