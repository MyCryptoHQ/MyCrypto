import React, { useContext } from 'react';
import styled from 'styled-components';
import { Heading } from '@mycrypto/ui';

import { RatesContext } from 'v2/services/RatesProvider';
import { StoreContext, getTotalByAsset } from 'v2/services/Store';
import { UNISWAP_EXCHANGE_TOKEN_UUIDS, COMPOUND_TOKEN_UUIDS } from 'v2/utils';

import AppreciatingAssetsTable from './AppreciatingAssetsTable';
import EarningAssetsTable from './EarningAssetsTable';

const DashboardWrapper = styled.div`
  width: 100%;
`;

const DashboardSubHeader = styled(Heading)`
  margin-top: 0;
  font-weight: bold;
  margin-bottom: 14px;
`;

const DefiDashboard = () => {
  const { getPoolAssetReserveRate } = useContext(RatesContext);
  const { accounts, assets, getDeFiAssetReserveAssets } = useContext(StoreContext);
  const uniswapPoolBalances = assets(accounts).filter(({ uuid }) =>
    UNISWAP_EXCHANGE_TOKEN_UUIDS.includes(uuid)
  );
  const compoundPoolBalances = assets(accounts).filter(({ uuid }) =>
    COMPOUND_TOKEN_UUIDS.includes(uuid)
  );
  const userUniswapPoolBalances = getTotalByAsset(uniswapPoolBalances);
  const userCompoundPoolBalances = getTotalByAsset(compoundPoolBalances);

  const earningAssets = Object.values(userUniswapPoolBalances).map(userUniswapPoolBalance => ({
    reserveAssets: getDeFiAssetReserveAssets(userUniswapPoolBalance)(getPoolAssetReserveRate),
    poolAsset: userUniswapPoolBalance
  }));

  const appreciatingAssets = Object.values(userCompoundPoolBalances).map(
    userCompoundPoolBalance => ({
      reserveAssets: getDeFiAssetReserveAssets(userCompoundPoolBalance)(getPoolAssetReserveRate),
      poolAsset: userCompoundPoolBalance
    })
  );

  return (
    <DashboardWrapper>
      <DashboardSubHeader as="h2" className="Dashboard-desktop-top-left-heading">
        Defi Dashboard
      </DashboardSubHeader>
      <EarningAssetsTable earningAssets={earningAssets} />
      <AppreciatingAssetsTable appreciatingAssets={appreciatingAssets} />
    </DashboardWrapper>
  );
};

export default DefiDashboard;
