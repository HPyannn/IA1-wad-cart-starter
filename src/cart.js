/**
 * Tính tổng tiền giỏ hàng = subtotal + VAT + phí ship, làm tròn đến đồng.
 *
 * @param {{ name: string, price: number, qty: number }[]} items
 * @param {{ vatRate: number, freeShipFrom: number, shipFee: number }} options
 * @returns {number}
 * @throws {RangeError} khi price âm/không hợp lệ hoặc qty không phải số nguyên dương
 */
export function cartTotal(items, options) {
  if (!Array.isArray(items)) {
    throw new TypeError("Giỏ hàng null / undefined / không phải là một mảng");
  } // Kiểm tra luôn cả null và undefined
  if (items.length === 0) return 0; // giỏ hàng rỗng

  if (options == null || typeof options !== "object") {
    throw new TypeError("options must be an object");
  }
  const { vatRate, freeShipFrom, shipFee } = options;
  for (const [key, value] of Object.entries({
    vatRate,
    freeShipFrom,
    shipFee,
  })) {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
      throw new RangeError(`${key} phải là số không âm, ${value}`);
    }
  }

  let subtotal = 0;
  for (const item of items) {
    if (item == null || typeof item !== "object") {
      throw new TypeError("Mỗi sản phẩm bên trong giỏ hàng phải khác null");
    }
    const { price, qty } = item;
    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
      throw new RangeError(`Giá sản phẩm không được âm, ${price}`);
    }
    if (!Number.isInteger(qty) || qty <= 0) {
      throw new RangeError(`Số lượng phải là số nguyên dương, ${qty}`);
    }
    subtotal += price * qty;
  }

  const vat = subtotal * vatRate;
  const shipping = subtotal >= freeShipFrom ? 0 : shipFee;

  // Làm tròn + trả về number
  return Math.round(subtotal + vat + shipping);
}
