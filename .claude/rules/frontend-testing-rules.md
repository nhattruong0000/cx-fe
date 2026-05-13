# Frontend Testing Rules (cx-fe)

## Mandatory E2E Verification (BẮT BUỘC)

Sau khi hoàn thành BẤT KỲ task frontend nào trong `cx-fe/` (UI, component, page, flow, bugfix UI), PHẢI verify kết quả cuối cùng bằng **agent-browser** skill (`/ck:agent-browser`) trước khi báo "done".

- KHÔNG được báo hoàn thành nếu chỉ dựa vào: `bun run type-check`, unit test pass, lint pass, screenshot tĩnh
- PHẢI chạy thực tế trong browser với user flow đầy đủ (login → navigate → thao tác → verify outcome)
- Nếu không thể chạy agent-browser (môi trường thiếu), PHẢI nói rõ với user thay vì claim success

## Dev Server

- Next.js dev: `bun dev` → `http://localhost:6001`
- Backend API: `cx-api` (ensure đã chạy & seed trước khi test)

## Test Accounts (từ `cx-api/db/seeds.rb`)

Password mặc định cho tất cả: `123123aA@`.

| Role | Email | Dùng khi |
|------|-------|----------|
| Admin | `admin@sonnguyenauto.com` | Admin panel, quyền cao nhất, full access |
| Staff (Manager) | `manager@sonnguyenauto.com` | Staff flows, quản lý |
| Staff (CSKH) | `cskh@sonnguyenauto.com` | Customer service flows |
| Staff (Kỹ thuật) | `kythuat@sonnguyenauto.com` | Technical/service flows |
| Customer | `khachhang@sonnguyenauto.com` | Customer-facing flows |

**Chọn tài khoản theo scope task:** login đúng role tương ứng với feature. Nếu feature ảnh hưởng nhiều role → test lần lượt.

## Verification Checklist

1. [ ] Ensure `cx-api` running + seeded (`bin/rails db:seed` nếu DB trống)
2. [ ] Start `cx-fe` dev (`bun dev` → port 6001)
3. [ ] Login bằng tài khoản phù hợp scope feature
4. [ ] Reproduce user flow đầy đủ feature vừa implement
5. [ ] Verify expected outcome (DOM state, navigation, data hiển thị đúng)
6. [ ] Check browser console — error liên quan feature → fail
7. [ ] Test ít nhất 1 edge case / error path (validation, empty state, permission denied)
8. [ ] Capture screenshot/snapshot làm evidence trong report

## Khi áp dụng

- Thay đổi UI, routing, data fetching, form handling
- Bug fix UI, refactor component có behavior change
- Tích hợp API mới từ FE
- Thay đổi auth flow, permission UI

## Không bắt buộc

- Pure styling tweak (color, spacing, typography) không đổi behavior → screenshot đủ
- Config/tooling không ảnh hưởng runtime
- Docs/comment only

## Failure Handling

Nếu agent-browser verify fail:
- KHÔNG "bỏ qua để commit sau" — fix ngay
- Log lỗi cụ thể (console error, network failure, wrong state)
- Delegate `debugger` nếu root cause chưa rõ
- Chỉ mark done khi verify pass

## Related

- `ui-component-qa-rules.md` — component QA trước implement
- `design-to-code-rules.md` — verify visual khớp design
- `primary-workflow.md` → Step 2 (Testing)
