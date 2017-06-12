import axios from 'axios';

// https://stackoverflow.com/questions/9828684/how-to-get-all-arguments-of-a-callback-function
export function combineAndUpper() {
    let args = [];
    let newString = '';
    for (let i = 0; i < arguments.length; ++i) args[i] = arguments[i];
    args.forEach((each) => {
        newString = newString.concat(each.toUpperCase())
    });
    return newString
}

export default class Bity {
    constructor() {
        this.SERVERURL = 'https://myetherapi.com';
        this.bityAPI = 'https://bity.com/api';
        this.decimals = 6;
        this.ethExplorer = 'https://etherscan.io/tx/[[txHash]]';
        this.btcExplorer = 'https://blockchain.info/tx/[[txHash]]';
        this.validStatus = ['RCVE', 'FILL', 'CONF', 'EXEC'];
        this.invalidStatus = ['CANC'];
        this.mainPairs = ['REP', 'ETH'];
        this.min = 0.01;
        this.max = 3;
        this.priceLoaded = false;
        this.postConfig = {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        };
    }

    findRateFromBityRateList(rateObjects, pairName) {
        return rateObjects.find(x => x.pair === pairName);
    }

    _getRate(bityRates, origin, destination) {
        let pairName = combineAndUpper(origin, destination);
        let rateObjects = bityRates.data.objects;
        return this.findRateFromBityRateList(rateObjects, pairName);
    }

    /**
     * Gives you multiple rates from Bitys API without making multiple API calls
     * @param arrayOfOriginAndDestinationDicts - [{origin: 'BTC', destination: 'ETH'}, {origin: 'BTC', destination: 'REP}]
     */
    getMultipleRates(arrayOfOriginAndDestinationDicts) {
        let mappedRates = {};
        return this.requestAllRates()
            .then((bityRates) => {
                arrayOfOriginAndDestinationDicts.forEach((each) => {
                    let origin = each.origin;
                    let destination = each.destination;
                    let pairName = combineAndUpper(origin, destination);
                    let rate = this._getRate(bityRates, origin, destination);
                    mappedRates[pairName] = parseFloat(rate.rate_we_sell)
                });
                return mappedRates
            })
        // TODO - catch errors
    }

    getAllRates() {
        let mappedRates = {};
        return this.requestAllRates()
            .then((bityRates) => {
                bityRates.data.objects.forEach((each) => {
                    let pairName = each.pair;
                    mappedRates[pairName] = parseFloat(each.rate_we_sell)
                });
                return mappedRates
            })
        // TODO - catch errors
    }

    requestAllRates() {
        let path = '/v1/rate2/';
        let bityURL = this.bityAPI + path
        return axios.get(bityURL)
    }
}
