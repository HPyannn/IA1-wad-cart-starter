import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { cartTotal } from "../src/cart.js";

// ---------- Dữ liệu dùng chung ----------
const OPTIONS = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 };
const item = (price, qty, name = "Hàng") => ({ name, price, qty });
const one = (price, qty = 1, options = OPTIONS) =>
  cartTotal([item(price, qty)], options);

// ---------- 1. Ví dụ mẫu ----------
test("the example from the slides", () => {
  const items = [
    { name: "Áo thun", price: 180000, qty: 2 },
    { name: "Sổ tay", price: 45000, qty: 1 },
  ];
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 };
  assert.equal(cartTotal(items, options), 467400);
});

// ---------- 2. Giỏ hàng rỗng ----------
describe("giỏ hàng rỗng", () => {
  test("trả về 0", () => {
    assert.equal(cartTotal([], OPTIONS), 0);
  });

  test("trả về 0 dù không truyền options", () => {
    assert.equal(cartTotal([]), 0);
  });
});

// ---------- 3. Ngưỡng miễn phí ship ----------
describe("ngưỡng free ship", () => {
  test("subtotal thấp hơn ngưỡng: tính ship", () => {
    // 499999 + VAT 39999.92 + ship 30000 = 569998.92 -> 569999
    assert.equal(one(499999), 569999);
  });

  test("subtotal đúng bằng ngưỡng: miễn ship", () => {
    const items = [item(200000, 1), item(300000, 1)];
    assert.equal(cartTotal(items, OPTIONS), 540000);
  });

  test("subtotal cao hơn ngưỡng: miễn ship", () => {
    const items = [item(300000, 1), item(400000, 1)];
    assert.equal(cartTotal(items, OPTIONS), 756000);
  });

  test("freeShipFrom = 0: luôn miễn ship", () => {
    assert.equal(one(1000, 1, { ...OPTIONS, freeShipFrom: 0 }), 1080);
  });
});

// ---------- 4. VAT và phí ship ----------
describe("VAT và phí ship", () => {
  test("vatRate = 0:", () => {
    assert.equal(one(100000, 1, { ...OPTIONS, vatRate: 0 }), 130000);
  });

  test("shipFee = 0: dưới ngưỡng vẫn không tốn ship", () => {
    assert.equal(one(100000, 1, { ...OPTIONS, shipFee: 0 }), 108000);
  });
});

// ---------- 5. Làm tròn đến đồng ----------
describe("làm tròn và kiểu dữ liệu trả về", () => {
  test("phần lẻ nhỏ thì làm tròn xuống", () => {
    // 100001 + VAT 8000.08 + ship 30000 = 138001.08 -> 138001
    assert.equal(one(100001), 138001);
  });

  test("phần lẻ lớn thì làm tròn lên", () => {
    // 100 + VAT 0.75 (vatRate 0.0075) + ship 0 = 100.75 -> 101
    assert.equal(
      one(100, 1, { vatRate: 0.0075, freeShipFrom: 0, shipFee: 0 }),
      101,
    );
  });

  test("kết quả luôn là số nguyên", () => {
    assert.ok(Number.isInteger(one(12345, 7)));
  });

  test("không bị sai số dấu phẩy động với số lớn", () => {
    // 999999999 x 1000 = 999999999000; VAT 79999999920; miễn ship
    assert.equal(one(999999999, 1000), 1079999998920);
  });
});

// ---------- 6. price không hợp lệ -> RangeError ----------
describe("price không hợp lệ ném RangeError", () => {
  const badPrices = [
    ["âm", -1],
    ["âm nhỏ", -0.01],
    ["NaN", NaN],
    ["Infinity", Infinity],
    ["chuỗi số", "100"],
    ["null", null],
    ["undefined (thiếu price)", undefined],
  ];
  for (const [label, price] of badPrices) {
    test(`price ${label}`, () => {
      assert.throws(() => one(price), RangeError);
    });
  }

  test("item thiếu trường price", () => {
    assert.throws(
      () => cartTotal([{ name: "A", qty: 1 }], OPTIONS),
      RangeError,
    );
  });
});

// ---------- 7. qty không hợp lệ -> RangeError ----------
describe("qty không phải số nguyên dương ném RangeError", () => {
  const badQtys = [
    ["bằng 0", 0],
    ["âm", -1],
    ["số thực", 1.5],
    ["số thực gần 1", 0.999],
    ["chuỗi số", "2"],
    ["NaN", NaN],
    ["Infinity", Infinity],
    ["null", null],
  ];
  for (const [label, qty] of badQtys) {
    test(`qty ${label}`, () => {
      assert.throws(() => one(1000, qty), RangeError);
    });
  }

  test("item thiếu trường qty", () => {
    assert.throws(
      () => cartTotal([{ name: "A", price: 1000 }], OPTIONS),
      RangeError,
    );
  });
});

// ---------- 8. Biên hợp lệ ----------
describe("giá trị biên hợp lệ", () => {
  test("price = 0 hợp lệ; subtotal 0 dưới ngưỡng nên vẫn tính ship", () => {
    // Quy ước: price = 0 không ném lỗi (brief chỉ cấm price âm)
    assert.equal(one(0), 30000);
  });

  test("thiếu name vẫn tính bình thường", () => {
    assert.equal(cartTotal([{ price: 100000, qty: 1 }], OPTIONS), 138000);
  });
});

// ---------- 9. Kiểu dữ liệu đầu vào sai -> TypeError ----------
describe("items sai kiểu ném TypeError", () => {
  const badItems = [
    ["null", null],
    ["undefined", undefined],
    ["object đơn", item(1000, 1)],
    ["chuỗi", "abc"],
    ["số", 5],
  ];
  for (const [label, value] of badItems) {
    test(`items là ${label}`, () => {
      assert.throws(() => cartTotal(value, OPTIONS), TypeError);
    });
  }

  test("một phần tử trong items là null", () => {
    assert.throws(() => cartTotal([null], OPTIONS), TypeError);
  });
});

// ---------- 10. options thiếu hoặc sai ----------
describe("options thiếu hoặc không hợp lệ", () => {
  for (const key of ["vatRate", "freeShipFrom", "shipFee"]) {
    test(`thiếu ${key} ném RangeError`, () => {
      const { [key]: _omit, ...rest } = OPTIONS;
      assert.throws(() => one(100000, 1, rest), RangeError);
    });
  }

  test("options = {} ném RangeError", () => {
    assert.throws(() => one(100000, 1, {}), RangeError);
  });

  test("options = undefined với giỏ không rỗng ném TypeError", () => {
    assert.throws(() => cartTotal([item(1000, 1)]), TypeError);
  });

  test("options = null với giỏ không rỗng ném TypeError", () => {
    assert.throws(() => cartTotal([item(1000, 1)], null), TypeError);
  });

  test("vatRate NaN ném RangeError", () => {
    assert.throws(() => one(1000, 1, { ...OPTIONS, vatRate: NaN }), RangeError);
  });

  test("vatRate âm ném RangeError", () => {
    assert.throws(
      () => one(1000, 1, { ...OPTIONS, vatRate: -0.08 }),
      RangeError,
    );
  });

  test("shipFee âm ném RangeError", () => {
    assert.throws(() => one(1000, 1, { ...OPTIONS, shipFee: -1 }), RangeError);
  });
});
