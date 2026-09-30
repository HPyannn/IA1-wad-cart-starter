# CLAUDE.md — quy tắc làm việc trong repo `cart-total`

## Dự án

Hàm `cartTotal(items, options)` tính tổng tiền giỏ hàng: `subtotal + VAT + phí ship`,
làm tròn đến đồng. Đặc tả đầy đủ (contract, lỗi, ví dụ) nằm trong `BRIEF.md`.
Nhật ký làm việc với AI nằm trong `AI-LOG.md`.

## Tech stack

- JavaScript thuần, ES Modules (`"type": "module"`), Node 20+
- Test: `node:test` và `node:assert/strict` (không dùng Jest, Mocha...)
- Công cụ dev: ESLint 9 (flat config) và Prettier 3, chỉ nằm trong `devDependencies`

## Cấu trúc

- `src/cart.js`: cài đặt `cartTotal` (export có tên)
- `test/cart.test.js`: toàn bộ test
- `.github/workflows/ci.yml`: CI chạy lint, format check và test khi push

## Lệnh

| Lệnh                   | Tác dụng                                                   |
| ---------------------- | ---------------------------------------------------------- |
| `npm ci`               | Cài dependencies theo `package-lock.json`                  |
| `npm test`             | Chạy test (`node --test`)                                  |
| `npm run lint`         | ESLint                                                     |
| `npm run format`       | Prettier tự sửa định dạng                                  |
| `npm run format:check` | Prettier chỉ kiểm tra (CI dùng lệnh này)                   |
| `npm run check`        | Lint + format check + test. **Phải xanh trước khi commit** |

## Quy ước code

- Trả về kiểu `number`; chỉ gọi `Math.round` **một lần ở cuối**
- Giỏ hàng rỗng: trả `0` trước mọi kiểm tra `options`
- Sai kiểu dữ liệu (`items` không phải mảng, item hoặc `options` không phải object): `TypeError`
- Giá trị không hợp lệ (`price` âm/NaN/sai kiểu, `qty` không phải số nguyên dương,
  thiếu hoặc âm `vatRate`, `freeShipFrom`, `shipFee`): `RangeError`
- Miễn ship khi `subtotal >= freeShipFrom`
- Mỗi test chỉ một lý do để fail; test kiểm tra đặc tả, không kiểm tra cách cài đặt
- Không dùng dấu chấm phẩy, dùng nháy đơn (Prettier lo phần này)

## NEVER

- KHÔNG thêm thư viện ngoài vào `src/` (chỉ JavaScript thuần)
- KHÔNG sửa test cho pass: test đỏ thì sửa `src/cart.js`
- KHÔNG dùng `toFixed` cho giá trị trả về (nó trả về string)
- KHÔNG làm thay đổi (mutate) mảng `items` hoặc object `options` đầu vào
- KHÔNG commit hoặc push khi `npm run check` đang đỏ
- KHÔNG sửa `package.json`, cấu hình lint hoặc CI nếu không được yêu cầu
