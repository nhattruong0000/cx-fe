# Design System Compliance Rules

> Rules cho AI agent khi thao tac voi `cx-fe/design/design-system.pen`

## Design System Reference (MANDATORY)
- **Node ID `jFCZd`** la design system source of truth
- TRUOC KHI them/sua bat ky design nao trong `cx-fe/design/design-system.pen`, PHAI:
  1. `batch_get` node `jFCZd` (readDepth 3+) de lay full design system tokens
  2. Ghi nhan: colors, typography, spacing, corner radius, shadows, border widths
  3. Dung nhung tokens nay cho TOAN BO design moi

## Token Compliance (STRICT)
- KHONG hardcode color values — PHAI dung design system variables/tokens
- KHONG tao font size/weight moi ngoai tokens da dinh nghia trong `jFCZd`
- KHONG dung spacing values ngoai scale da co trong design system
- KHONG tao shadow/border/radius values moi — dung tu design system
- Neu can token chua co → bao user truoc, KHONG tu y tao moi

## Component Reuse (STRICT)
- `batch_get` de discover existing components trong design system TRUOC khi tao moi
- Neu component tuong tu da ton tai → dung lai, KHONG duplicate
- Neu can variant moi → extend component hien tai, giu chung token set
- Khi tao component moi (duoc user cho phep) → PHAI dung tokens tu `jFCZd`

## Page Consistency (MANDATORY)
- TRUOC khi design page moi, PHAI `batch_get` cac pages da co trong file de hieu:
  - Layout patterns (grid, spacing, section structure)
  - Component usage patterns (nao dung cho header, nav, content, footer)
  - Visual rhythm (khoang cach giua sections, padding patterns)
- Pages moi PHAI nhat quan voi pages truoc ve:
  - Spacing va layout grid
  - Component patterns da establish
  - Visual hierarchy va typography scale
  - Color usage patterns (primary/secondary/accent placement)

## Frame Naming Consistency
- Frame names PHAI theo format da establish: `Category / Component Name`
- Kiem tra naming convention cua frames hien co bang `batch_get` truoc khi dat ten
- Dung cung prefix system da co (Auth, Account, Admin, Dialog, Component...)
- KHONG tao prefix moi ma khong kiem tra prefix hien co truoc

## Pre-Design Checklist (BAT BUOC truoc moi lan them/sua design)
1. [ ] `batch_get` design system node `jFCZd` (readDepth 3+)
2. [ ] `batch_get` existing pages/frames de hieu patterns hien co
3. [ ] Liet ke tokens/components se dung — verify tat ca tu design system
4. [ ] Verify frame naming theo convention hien co
5. [ ] Design xong → `get_screenshot` verify visual consistency voi pages truoc
6. [ ] Neu phat hien inconsistency → fix TRUOC khi bao hoan thanh

## Maintenance Note
- Neu design system node ID thay doi (restructure) → update `jFCZd` trong rule nay
- Dinh ky verify node ID van hop le bang `batch_get`
