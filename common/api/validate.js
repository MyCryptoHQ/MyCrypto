// Functions for <InputComponent /> validation,
// FEEL FREE TO REMOVE THIS FILE AND components/InputComponent.jsx,
export function maxSize(num, error = 'Value is too long') {
    return function (value) {
        if (value) {
            return value.length > num ? error : true
        }
    }
}

export function noSpace(str) {
    // trully can't get why do we need this check,
    // but without it on /profile/settings page we get error
    if (str !== undefined) {
        return true;
    }
    return str.match(/[^-\s]/g) ? true : false
}

export function isRequired(str, field) {
    if (str && str.length === 0) {
        return `Please, enter your ${field}`
    }
    return true
}

export function latin(str) {
    return str.match(/[a-zA-Z0-9]+/g) ? true : false
}

export function number(str) {
    return str.match(/\d+/g) ? true : false
}

export function email() {
}

export function phone() {
}

export function composition(array) {
    return function (value, field) {
        for (let i = 0; i < array.length; i++) {
            if (array[i](value, field) !== true) {
                return array[i](value, field)
            }
        }
        return false
    }
}

export default {
    isRequired,
    phone,
    email,
    noSpace,
    number,
    latin,
    maxSize,
    composition
}
