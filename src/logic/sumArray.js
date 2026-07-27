export function sumArray(array) {
  return array.reduce(
    (currentSum, currentValue) => currentSum + currentValue,
    0,
  );
}
