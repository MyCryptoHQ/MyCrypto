import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { DashboardPanel, CollapsibleTable, Tooltip, CombinedBalance } from 'v2/components';
import { translateRaw } from 'v2/translations';
import { breakpointToNumber, BREAK_POINTS } from 'v2/theme';
import { StoreAsset } from 'v2/types/asset';
import { SettingsContext } from 'v2/services/Store';
import { RatesContext } from 'v2/services';
import { DefiAssetsObject } from './types';
import IconArrow from 'v2/components/IconArrow';
import { convertToFiatFromAsset } from 'v2/utils';
import { Fiats } from 'v2/config';

const TableContainer = styled.div`
  display: block;
  overflow: auto;
  flex: 1;
  max-height: 600px;
`;
const ValueContainer = styled.div`
  display: flex;
  align-items: center;
  float: right;
  flex: 1;
`;

interface Props {
  earningAssets: DefiAssetsObject[];
}

interface ITableEntryType {
  poolAsset: StoreAsset;
  reserveAssets: StoreAsset[];
  index: number;
  gains: number;
  total: number;
}

type ISortTypes =
  | 'gain'
  | 'gain-reverse'
  | 'poolAsset'
  | 'poolAsset-reverse'
  | 'value'
  | 'value-reverse';
type IColumnValues = 'EARNING_ASSETS_GAIN' | 'EARNING_ASSETS_POOL' | 'EARNING_ASSETS_VALUE';

interface ISortingState {
  sortState: {
    EARNING_ASSETS_GAIN: 'gain' | 'gain-reverse';
    EARNING_ASSETS_POOL: 'poolAsset' | 'poolAsset-reverse';
    EARNING_ASSETS_VALUE: 'value' | 'value-reverse';
  };
  activeSort: ISortTypes;
}

const initialSortingState: ISortingState = {
  sortState: {
    EARNING_ASSETS_GAIN: 'gain',
    EARNING_ASSETS_POOL: 'poolAsset',
    EARNING_ASSETS_VALUE: 'value'
  },
  activeSort: 'value'
};
type TSortFunction = (a: ITableEntryType, b: ITableEntryType) => number;

const getSortingFunction = (sortKey: ISortTypes): TSortFunction => {
  switch (sortKey) {
    case 'value':
      return (a: ITableEntryType, b: ITableEntryType) => b.total - a.total;
    case 'value-reverse':
      return (a: ITableEntryType, b: ITableEntryType) => a.total - b.total;
    case 'gain':
      return (a: ITableEntryType, b: ITableEntryType) => b.gains - a.gains;
    case 'gain-reverse':
      return (a: ITableEntryType, b: ITableEntryType) => a.gains - b.gains;
    case 'poolAsset':
      return (a: ITableEntryType, b: ITableEntryType) =>
        a.poolAsset.name.localeCompare(b.poolAsset.name);
    case 'poolAsset-reverse':
      return (a: ITableEntryType, b: ITableEntryType) =>
        b.poolAsset.name.localeCompare(a.poolAsset.name);
  }
};

const EarningAssetsTable = ({ earningAssets }: Props) => {
  return (
    <DashboardPanel
      heading={
        <>
          {translateRaw('EARNING_ASSETS_TABLE_HEADER')}{' '}
          <Tooltip tooltip={translateRaw('DASHBOARD_ACCOUNTS_TOOLTIP')} />
        </>
      }
      // headingRight={headingRight}
      // actionLink={actionLink}
      className={`EarningAssetsTable`}
    >
      <TableContainer>
        <CollapsibleTable
          breakpoint={breakpointToNumber(BREAK_POINTS.SCREEN_XS)}
          {...buildEarningAssetsTable(earningAssets)}
        />
      </TableContainer>
    </DashboardPanel>
  );
};

const buildEarningAssetsTable = (earningAssets: DefiAssetsObject[]) => {
  const [sortingState, setSortingState] = useState(initialSortingState);
  const { getAssetRate } = useContext(RatesContext);
  const { settings } = useContext(SettingsContext);

  const updateSortingState = (id: IColumnValues) => {
    const currentBtnState = sortingState.sortState[id];
    if (currentBtnState.indexOf('-reverse') > -1) {
      const newActiveSort = currentBtnState.split('-reverse')[0] as ISortTypes;
      setSortingState({
        sortState: {
          ...sortingState.sortState,
          [id]: newActiveSort
        },
        activeSort: newActiveSort
      });
    } else {
      const newActiveSort = (currentBtnState + '-reverse') as ISortTypes;
      setSortingState({
        sortState: {
          ...sortingState.sortState,
          [id]: newActiveSort
        },
        activeSort: newActiveSort
      });
    }
  };

  const getColumnSortDirection = (id: IColumnValues): boolean =>
    sortingState.sortState[id].indexOf('-reverse') > -1 ? true : false;

  const convertColumnToClickable = (id: IColumnValues) => (
    <div onClick={() => updateSortingState(id)}>
      {translateRaw(id)} <IconArrow isFlipped={getColumnSortDirection(id)} />
    </div>
  );

  const columns = [
    convertColumnToClickable('EARNING_ASSETS_POOL'),
    //convertColumnToClickable('EARNING_ASSETS_GAIN'),
    convertColumnToClickable('EARNING_ASSETS_VALUE')
  ];

  const getFullTableData = earningAssets
    .map((appreciatingAsset, index) => {
      return {
        total: appreciatingAsset.reserveAssets.reduce(
          (sum, asset) => (sum += convertToFiatFromAsset(asset, getAssetRate(asset))),
          0
        ),
        reserveAssets: appreciatingAsset.reserveAssets,
        gains: 0,
        poolAsset: appreciatingAsset.poolAsset,
        index
      };
    })
    .sort(getSortingFunction(sortingState.activeSort));

  return {
    head: columns,
    body: getFullTableData.map(({ poolAsset, index, total, reserveAssets }) => [
      <p key={index}>{poolAsset.name}</p>,
      <ValueContainer key={2}>
        <CombinedBalance
          key={2}
          fiat={Fiats[settings.fiatCurrency]}
          fiatValue={total}
          assets={reserveAssets}
        />
      </ValueContainer>
    ]),
    config: {
      primaryColumn: translateRaw('EARNING_ASSETS_VALUE')
    }
  };
};

export default EarningAssetsTable;
