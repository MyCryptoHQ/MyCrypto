//flow

// https://stackoverflow.com/questions/9539513/is-there-a-reliable-way-in-javascript-to-obtain-the-number-of-decimal-places-of
const decimalPlaces = (function() {
  function isInt(n) {
    return (
      typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n)
    );
  }
  return function(n) {
    let a = Math.abs(n);
    let c = a,
      count = 1;
    while (!isInt(c) && isFinite(c)) {
      c = a * Math.pow(10, count++);
    }
    return count - 1;
  };
})();

export function toFixedIfLarger(number: number, fixedSize: number = 6): string {
  if (decimalPlaces(number) > fixedSize) {
    return number.toFixed(fixedSize);
  } else {
    return String(number);
  }
}
