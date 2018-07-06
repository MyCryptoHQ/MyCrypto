import shapeshift, { SHAPESHIFT_BASE_URL } from './shapeshift';

describe('ShapeShift service', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn().mockImplementation(
      (url: string) =>
        new Promise(resolve => {
          const returnValues = {
            [`${SHAPESHIFT_BASE_URL}/marketinfo`]: {
              status: 200,
              json: () => [
                {
                  limit: 1,
                  maxLimit: 2,
                  min: 1,
                  minerFee: 2,
                  pair: 'BTC_ETH',
                  rate: '1.0'
                },
                {
                  limit: 1,
                  maxLimit: 2,
                  min: 1,
                  minerFee: 2,
                  pair: 'ETH_BTC',
                  rate: '1.0'
                }
              ]
            },
            [`${SHAPESHIFT_BASE_URL}/getcoins`]: {
              status: 200,
              json: () => ({
                BTC: {
                  name: 'Bitcoin',
                  symbol: 'BTC',
                  image: '',
                  imageSmall: '',
                  status: 'available',
                  minerFee: 1
                },
                ETH: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  image: '',
                  imageSmall: '',
                  status: 'available',
                  minerFee: 1
                },
                XMR: {
                  name: 'Monero',
                  symbol: 'XMR',
                  image: '',
                  imageSmall: '',
                  status: 'unavailable',
                  minerFee: 1
                }
              })
            }
          };

          resolve(returnValues[url]);
        })
    );
  });
  it('provides a collection of all available and unavailable coins and tokens', async done => {
    const rates = await shapeshift.getAllRates();

    expect(rates).toEqual({
      BTCETH: {
        id: 'BTCETH',
        rate: '1.0',
        limit: 1,
        min: 1,
        options: [
          {
            id: 'BTC',
            image: '',
            name: 'Bitcoin',
            status: 'available'
          },
          {
            id: 'ETH',
            image: '',
            name: 'Ethereum',
            status: 'available'
          }
        ]
      },
      ETHBTC: {
        id: 'ETHBTC',
        rate: '1.0',
        limit: 1,
        min: 1,
        options: [
          {
            id: 'ETH',
            image: '',
            name: 'Ethereum',
            status: 'available'
          },
          {
            id: 'BTC',
            image: '',
            name: 'Bitcoin',
            status: 'available'
          }
        ]
      },
      __XMR: {
        id: '__XMR',
        limit: 0,
        min: 0,
        options: [
          {
            id: 'XMR',
            image: '',
            name: 'Monero',
            status: 'unavailable'
          }
        ]
      }
    });
    done();
  });
});
