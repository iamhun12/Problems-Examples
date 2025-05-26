const initialStock = { tons: 1, kilograms: 0, grams: 0, milligrams: 0 };
const result = updateStock(
  initialStock,
  { tons: 1, kilograms: 3, grams: 4, milligrams: 0 },
  "purchase"
);
console.log(result);

function updateStock(initialStock, trade, operation) {
  if (!["purchase", "sale"].includes(operation)) {
    throw new Error("invalid Input");
  }

  const milligramsInitialStock = convertStock(initialStock);
  const milligramsTrade = convertStock(trade);

  const milligramsResult =
    operation === "purchase"
      ? milligramsInitialStock + milligramsTrade
      : milligramsInitialStock - milligramsTrade;
  return normalizeStocks(milligramsResult);
}

function convertStock(stocks) {
  return (
    stocks.tons * 1_000_000_000 +
    stocks.kilograms * 1_000_000 +
    stocks.grams * 1_000 +
    stocks.milligrams
  );
}

function normalizeStocks(milligramStocks) {
  let remainder = 0;
  const tons = Math.floor(milligramStocks / 1_000_000_000);
  remainder = milligramStocks % 1_000_000_000;
  const kilograms = Math.floor(remainder / 1_000_000);
  remainder = remainder % 1_000_000;
  const grams = Math.floor(remainder / 1_000);
  const milligrams = remainder % 1_000;
  return { tons, kilograms, grams, milligrams };
}
