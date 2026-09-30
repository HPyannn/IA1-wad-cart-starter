# Brief yêu cầu bài tập

Cài đặt hàm `cartTotal(items, options)` trong `src/cart.js` để tính tổng tiền cho giỏ hàng.

## Scope

- Sửa: `src/cart.js`, `test/cart.test.js`
- Không sửa: `package.json`, `.github/`, cấu hình lint
- Test đỏ thì sửa code, không sửa test

## Contract

cartTotal(items, options) -> number

- items: [{ name: string, price: number >= 0, qty: integer > 0 }]
- options: { vatRate: số thực (tỷ lệ), freeShipFrom: number, shipFee: number }

## Input

Hàm cartTotal(items, options) nhận vào hai tham số:

1. `items`: `[{ name, price, qty }]` - Mảng chứa các thông tin của từng mặt hàng
2. `options`: `{ vatRate, freeShipFrom, shipFee }` - Chứa các thông tin thuế và vận chuyển

## Xử lý tính toán

- `subtotal` = tổng của `price × qty`
- VAT = `vatRate` áp dụng cho `subtotal`
- Miễn phí ship khi `subtotal >= freeShipFrom`, ngược lại áp dụng `shipFee`

## Output

- Trả về `subtotal + VAT + shipping`, **1 con số (a number)**, làm tròn đến đơn vị đồng
- Nếu giỏ hàng rỗng trả về `0` — không VAT, không phí ship

## Xử lý lỗi

| Đầu vào                                       | Kết quả    |
| --------------------------------------------- | ---------- |
| `price` < 0, NaN, Infinity, không phải number | RangeError |
| `qty` là 0, âm, số thực (1.5), chuỗi ('2')    | RangeError |
| `items` null / undefined / không phải mảng    | TypeError  |
| `options` null / undefined                    | TypeError  |

## Ràng buộc

- Chỉ sử dụng JavaScript thuần, không thư viện ngoài
- Test: node:test + node:assert/strict
- Không mutate input, không console.log

Ví dụ:

```js
const items = [
  { name: "Áo thun", price: 180000, qty: 2 },
  { name: "Sổ tay", price: 45000, qty: 1 },
];
const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 };
```

subtotal: 2 × 180000 + 1 × 45000 = 405000, VAT: 32400, ship: 30000 (ít hơn 500000) → **467400**.
