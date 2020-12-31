import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { FixedSizeCollapsibleTable } from '@components';
import { BREAK_POINTS, breakpointToNumber } from '@theme';
import { translateRaw } from '@translations';
import { ProviderHandler } from '@services';
import { Network } from '@types';
import { isSameAddress } from '@utils';

import { MyTokensProps, IFormattedLogEntry } from './types';

const RowAlignment = styled.div`
  float: ${(props: { align?: string }) => props.align || 'inherit'};
`;
const NoSpenders = styled.span`
  text-decoration: italic;
  color: #d4d4d4;
`

const getApprovalEvents = async (contractAddress: string, address: string, network: Network) => {
  const provider = new ProviderHandler(network);
  return provider.getTokenApprovals(contractAddress, address);
}

export default function MyTokens({ address, assets, network }: MyTokensProps) {
  const [tokenAllowances, setTokenAllowances] = useState([])

  useEffect(() => {
    async function getEvents() {
      await getTokenApprovalEvents();
    }

    getEvents();
  }, assets)

  const getTokenApprovalEvents = async () => {
    Promise.all(
      assets.map(async (asset) => {
        const { contractAddress, decimal } = asset
        const logs = await getApprovalEvents(contractAddress as string, address, network)

        logs.map((log) => {
          const spenderAddress = `0x` + log.topics[2].substr(log.topics[2].length - 40);

          if (isSameAddress(spenderAddress, contractAddress)) {
            return false
          }

          const formattedLog = {
            "tokenContract": contractAddress,
            "decimals": decimal,
            "spender": spenderAddress,
            "allowance": log.data
          }

          setTokenAllowances(tokenAllowances => [formattedLog, ...tokenAllowances])
        })
      })
    )
  }

  const formatAllowance = (allowance: string, decimals: number) => {
    // @todo - format this to be human readable (ie: 1000...00000/1e18)
    return allowance;
  }

  const formatAddress = (address: string) => {
    const addr = `0x` + address.substr(address.length - 40);
    //@todo - do some address to label lookup here!
    return addr;
  }

  const formatAllowanceRecords = (contractAddress: string) => {
    const contractSpecificEvents = tokenAllowances.filter((ev: IFormattedLogEntry) => ev.tokenContract === contractAddress)

    if (contractSpecificEvents.length === 0) {
      return <NoSpenders>No address is approved to spend this token</NoSpenders>
    }

    return <ul>
      {contractSpecificEvents.map((ev, index) => {
        const { spender, allowance, decimals } = ev;
        return (<li key={index}>{formatAddress(spender)} can spend {formatAllowance(allowance, decimals)}</li>)
      })}
    </ul>
  }

  const tokenTable = {
    head: [
      translateRaw('TOKEN_ALLOWANCES_TABLE_TOKEN_INFO_HEADER'),
      translateRaw('TOKEN_ALLOWANCES_TABLE_SPENDER_INFO_HEADER'),
    ],
    body: assets.map((asset, index: number) => {
      return [
        <RowAlignment key={index}>
          {asset.ticker} - {asset.name}
        </RowAlignment>,
        <RowAlignment key={2}>
          {formatAllowanceRecords(asset.contractAddress as string)}
        </RowAlignment>
      ];
    }),
    config: {
      primaryColumn: translateRaw('TOKEN_ALLOWANCES_TABLE_TOKEN_INFO_HEADER')
    }
  };

  return (
    <FixedSizeCollapsibleTable
      breakpoint={breakpointToNumber(BREAK_POINTS.SCREEN_XS)}
      {...tokenTable}
    />
  );
}