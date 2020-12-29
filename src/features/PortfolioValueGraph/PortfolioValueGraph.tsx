import React, { useContext, useEffect, useState } from 'react';

import { Heading } from '@mycrypto/ui';
import BigNumber from 'bignumber.js';
import { formatEther } from 'ethers/utils';
import { flatten } from 'ramda';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import styled from 'styled-components';

import { DashboardPanel } from '@components';
import { StoreContext } from '@services';
import { BREAK_POINTS, SPACING } from '@theme';
import { bigify, formatDate, mapAsync } from '@utils';

const DashboardWrapper = styled.div`
  width: 100%;
`;

const DashboardSubHeader = styled(Heading)`
  margin-top: ${SPACING.NONE};
  font-weight: bold;
  margin-bottom: ${SPACING.BASE};
`;

const StyledLayout = styled.div`
  width: 960px;
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 100%;
  }
  .Layout-content {
    padding: ${SPACING.NONE};
  }
`;

const buildQueryURL = (asset: string, fiat: string, from: number, to: number) =>
  `https://api.coingecko.com/api/v3/coins/${asset}/market_chart/range?vs_currency=${fiat}&from=${from}&to=${to}`;

type PortfolioValueState = { timestamp: number; value: string }[];

export default function PortfolioValueGraph() {
  const [data, setData] = useState<PortfolioValueState | undefined>(undefined);
  const { assets } = useContext(StoreContext);

  useEffect(() => {
    const a = assets();
    mapAsync(a, async (asset) => {
      if (!asset.mappings || !asset.mappings.coinGeckoId) {
        return [];
      }
      const url = buildQueryURL(asset.mappings!.coinGeckoId, 'eur', 1577491200, 1609169111);
      const result = await fetch(url).then((res) => res.json());
      const prices = result.prices as [number, string][];
      return prices.map(([timestamp, value]) => ({
        value: bigify(formatEther(asset.balance)).multipliedBy(bigify(value)),
        timestamp
      }));
    })
      .then((result) =>
        flatten(result).reduce<{ timestamp: number; value: BigNumber }[]>((acc, value) => {
          const existingIdx = acc.findIndex((a) => a.timestamp === value.timestamp);
          if (existingIdx === -1) {
            acc.push(value);
          } else {
            acc[existingIdx].value = acc[existingIdx].value.plus(value.value);
          }
          console.log(value);
          return acc;
        }, [])
      )
      .then((array) => array.map((a) => ({ ...a, value: a.value.toString() })))
      .then(setData);
  }, []);

  return (
    <StyledLayout>
      <DashboardWrapper>
        <DashboardSubHeader as="h2" className="Dashboard-desktop-top-left-heading">
          Portfolio Performance
        </DashboardSubHeader>
        <DashboardPanel heading="Portfolio Performance">
          {data ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <XAxis
                  dataKey="timestamp"
                  interval={30}
                  tickFormatter={(time) =>
                    new Date(time).toLocaleString('default', { month: 'long' })
                  }
                />
                <Tooltip
                  labelFormatter={(time) => formatDate(parseInt(time.toString()) / 1000)}
                  formatter={(value) => `${parseFloat(value.toString()).toFixed(4)} EUR`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <>Loading</>
          )}
        </DashboardPanel>
      </DashboardWrapper>
    </StyledLayout>
  );
}
