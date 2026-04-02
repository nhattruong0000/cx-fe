# UI Component QA Rules

## Visual Element Rendering
- Separator, Divider, Border: KHÔNG tin tưởng component mặc định sẽ render đúng
- Nếu component dùng conditional CSS (data-*, aria-*), verify attribute được set đúng
- Khi nghi ngờ, dùng plain HTML element thay vì component wrapper (vd: `<div className="h-px w-full bg-border" />` thay vì `<Separator />` nếu Separator không render)

## Component-Design System Mapping
- Badge: verify padding, fontSize, fontWeight, variant colors khớp design system
- Avatar: verify size variants (sm/md/lg) khớp design pixel values
- Dialog: verify header/content/footer spacing khớp design padding values
- Khi design dùng component (vd Badge/Success), đọc .pen spec để biết exact fill/text colors

## Pre-Implementation Checklist
Trước khi code UI từ design:
1. [ ] Đọc .pen component specs (batch_get với readDepth 3+)
2. [ ] Đọc code component source (variants, sizes, colors)
3. [ ] Liệt kê mismatches giữa design vs code
4. [ ] Sửa component mismatches TRƯỚC
5. [ ] Implement feature
6. [ ] So sánh visual output với design screenshot
