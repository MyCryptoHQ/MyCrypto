export function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

export function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}

export function isEmpty(n) {
    return n === ''
}

export function isFloatOrInt(n) {
    return (isFloat(n) || isInt(n))
}
