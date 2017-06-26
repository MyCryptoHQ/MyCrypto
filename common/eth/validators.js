// @flow
import { normalise } from './ens';
import { toChecksumAddress } from 'ethereumjs-util';

export function isValidHex(str: string): boolean {
    if (typeof str !== 'string') {
        return false;
    }
    if (str === '') return true;
    str = str.substring(0, 2) == '0x' ? str.substring(2).toUpperCase() : str.toUpperCase();
    var re = /^[0-9A-F]+$/g;
    return re.test(str);
}

export function isValidENSorEtherAddress(address: string): boolean {
    return isValidAddress(address) || isValidENSAddress(address);
}

export function isValidENSName(str: string) {
    try {
        return str.length > 6 && normalise(str) != '' && str.substring(0, 2) != '0x';
    } catch (e) {
        return false;
    }
}

export function isValidENSAddress(address: string): boolean {
    try {
        const normalized = normalise(address);
        var tld = normalized.substr(normalized.lastIndexOf('.') + 1);
        var validTLDs = {
            eth: true,
            test: true,
            reverse: true
        };
        if (validTLDs[tld]) return true;
    } catch (e) {
        return false;
    }
    return false;
}

function isChecksumAddress(address: string): boolean {
    return address == toChecksumAddress(address);
}

function validateEtherAddress(address: string): boolean {
    if (address.substring(0, 2) != '0x') return false;
    else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false;
    else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address))
        return true;
    else return isChecksumAddress(address);
}

// FIXME already in swap PR somewhere
export function isValidAddress(address: string): boolean {
    if (!address) {
        return false;
    }
    if (address == '0x0000000000000000000000000000000000000000') return false;
    return validateEtherAddress(address);
}
