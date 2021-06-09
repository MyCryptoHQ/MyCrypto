interface ReserveMappingRate {
  assetId: string;
  rate: string; // Is a BigNumberJS float string
}

interface ReserveMappingObject {
  type: string;
  lastUpdated: number;
  reserveRates: ReserveMappingRate[];
}

export type ReserveMapping = Record<string, ReserveMappingObject>;

export const fDefiReserveRates: ReserveMapping = {
  ['0039e50a-bab5-52fc-a48f-43f36410a87a']: {
    type: 'uniswap',
    lastUpdated: 1598034856,
    reserveRates: [
      {
        assetId: '356a192b-7913-504c-9457-4d18c28d46e6',
        rate: '2.368285030204416'
      },
      {
        assetId: '4451ce86-8299-5e38-8495-e24225c28e59',
        rate: '5182.017024470475'
      }
    ]
  },
  ['021ce881-6817-55b1-a92c-ee824b5646b5']: {
    type: 'uniswap',
    lastUpdated: 1598167956,
    reserveRates: [
      {
        assetId: '356a192b-7913-504c-9457-4d18c28d46e6',
        rate: '0.8084048206088129'
      },
      {
        assetId: '3c348242-f1b8-5372-8b2a-5a862d7205c4',
        rate: '229.7411562823249'
      }
    ]
  }
};
