# Self Assessment Report

Submitted by: 24120406 - Nguyễn Huỳnh Huy Phát \
Repository: https://github.com/HPyannn/IA1-wad-cart-starter

**Total I claim:** 100 / 100

| Criterion | Max | I claim | Evidence |
|---|---|---|---|
| Behaviour | 30 | 30 | -Ví dụ mẫu trả về đúng kết quả 467400 dưới định dạng number \([./src/cart.js#L48](./src/cart.js#L48)\) </br> -Miễn phí ship đúng tại ngưỡng \([./src/cart.js#L45](./src/cart.js#L45)\) </br> -Giỏ hàng rỗng trả về 0 \([./src/cart.js#L13](./src/cart.js#L13)\) </br> -Giá tiền bị âm hoặc số lượng không phải số nguyên thì ném ra lỗi `RangeError` \([./src/cart.js#L35](./src/cart.js#L35) và [./src/cart.js#L38](./src/cart.js#L38)\) |
| Tests | 20 | 20 | -Ví dụ mẫu \([./test/cart.test.js#L12](./test/cart.test.js#L12)\) </br> -Giỏ hàng rỗng \([./test/cart.test.js#L22](./test/cart.test.js#L22)\) </br> -Ngưỡng miễn phí ship \([./test/cart.test.js#L33](./test/cart.test.js#L33)\) </br> -cả hai trường hợp lỗi `RangeError` \([./test/cart.test.js#L91](./test/cart.test.js#L91) và [./test/cart.test.js#L116](./test/cart.test.js#L116)\) |
| Harness | 20 | 20 | -Có file quy tắc rõ ràng, bao gồm tech stack, các câu lệnh, và có quy định "never" - không được làm gì \([CLAUDE.md](./CLAUDE.md)\)</br> -Có cổng kiểm duyệt hoạt động (`npm test` kèm theo linter hoặc formatter) \([package.json](./package.json)\) </br> -Có thiết lập CI tự động chạy khi push code \([ci.yml](./.github/workflows/ci.yml)\) |
| Brief | 15 | 15 | -Chỉ rõ tên các file được phép chỉnh sửa \([BRIEF.md#scope](./BRIEF.md#scope)\) </br> -Contract (yêu cầu, input, output,...) \([BRIEF.md](./BRIEF.md#input)\) </br> -Các trường hợp lỗi \([BRIEF.md#xử-lý-lỗi](./BRIEF.md#xử-lý-lỗi)\) </br> -Ràng buộc "không dùng thư viện ngoài" \([BRIEF.md#ràng-buộc](./BRIEF.md#ràng-buộc)\) |
| AI-LOG.md | 15 | 15 | Ghi rõ công cụ AI, trung thực, đúng cấu trúc những gì AI tạo ra, những phần sinh viên đã thay đổi hay bỏ, và phần sinh viên tự viết \([AI-LOG.md](./AI-LOG.md)\) |

## What I did not manage
- `name` trong các `items` không được xử lý
- Chưa xử lý số quá lớn: Nếu `price × qty` vượt `Number.MAX_SAFE_INTEGER` thì kết quả mất chính xác, hiện chưa có kiểm tra hay test.

## What I would do differently
Viết brief đầy đủ hơn trước khi nhờ AI. Brief ban đầu thiếu kiểm tra các trường cho `options` nên hàm ban đầu trả NaN mà không báo lỗi, đến khi hỏi lại mới phát hiện.