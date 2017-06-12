// @flow
export const SWAP_ORIGIN_KIND = 'SWAP_ORIGIN_KIND';
export const SWAP_DESTINATION_KIND = 'SWAP_DESTINATION_KIND';
export const SWAP_ORIGIN_AMOUNT = 'SWAP_ORIGIN_AMOUNT';
export const SWAP_DESTINATION_AMOUNT = 'SWAP_DESTINATION_AMOUNT';
export const SWAP_UPDATE_BITY_RATES = 'SWAP_UPDATE_BITY_RATES';


export const SWAP_ORIGIN_KIND_TO = (value: any) => {
    return {
        type: SWAP_ORIGIN_KIND,
        value
    };
};

export const SWAP_DESTINATION_KIND_TO = (value: any) => {
    return {
        type: SWAP_DESTINATION_KIND,
        value
    }
}

export const SWAP_ORIGIN_AMOUNT_TO = (value: any) => {
    return {
        type: SWAP_ORIGIN_AMOUNT,
        value
    };
};

export const SWAP_DESTINATION_AMOUNT_TO = (value: any) => {
    return {
        type: SWAP_DESTINATION_AMOUNT,
        value
    }
}

export const SWAP_UPDATE_BITY_RATES_TO = (value: any) => {
    return {
        type: SWAP_UPDATE_BITY_RATES,
        value
    }
}
