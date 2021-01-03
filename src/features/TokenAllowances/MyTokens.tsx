import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { FixedSizeCollapsibleTable } from '@components';
import { ProviderHandler } from '@services';
import { BREAK_POINTS, breakpointToNumber } from '@theme';
import { translateRaw } from '@translations';
import { Network } from '@types';
import { hexWeiToString } from '@utils';
import { Contracts } from '@database';

import { IFormattedLogEntry, MyTokensProps } from './types';

const RowAlignment = styled.div`
  float: ${(props: { align?: string }) => props.align || 'inherit'};
`;
const NoSpenders = styled.span`
  text-decoration: italic;
  color: #d4d4d4;
`;

const getApprovalEvents = async (contractAddress: string, address: string, network: Network) => {
  const provider = new ProviderHandler(network);
  return provider.getTokenApprovals(contractAddress, address);
};

export default function MyTokens({ address, assets, network }: MyTokensProps) {
  const [tokenAllowances, setTokenAllowances] = useState<any>([]);

  useEffect(() => {
    async function getEvents() {
      await getTokenApprovalEvents();
    }

    getEvents();
  }, assets);

  const getTokenApprovalEvents = async () => {
    Promise.all(
      assets.map(async (asset) => {
        const { contractAddress, decimal } = asset;
        const logs = await getApprovalEvents(
          contractAddress as string,
          address,
          network as Network
        );

        logs.map((log) => {
          const spenderAddress = `0x` + log.topics[2].substr(log.topics[2].length - 40);

          const formattedLog = {
            tokenContract: contractAddress,
            decimals: decimal,
            spender: spenderAddress,
            allowance: log.data,
            blockNumber: log.blockNumber
          };

          setTokenAllowances((tokenAllowances: IFormattedLogEntry) => [
            formattedLog,
            ...tokenAllowances
          ]);
        });
      })
    );
  };

  const formatAllowance = (allowance: string, decimals: number) => {
    // @todo - get the totalSupply of the contract also
    if (allowance === [`0x`, `f`.repeat(64)].join("")) {
      return `Unlimited`;
    }

    return `${allowance}/${decimals} - ${(hexWeiToString(allowance))}`;
  };

  const formatAddress = (address: string) => {
    const addr = `0x` + address.substr(address.length - 40);

    const namedContract = Contracts.Ethereum.filter((contract) => contract.address.toLowerCase() === address.toLowerCase())
    if (namedContract.length > 0) {
      //@todo - make this link out to the block explorer?
      return namedContract[0].name
    }

    return addr;
  };

  const formatAllowanceRecords = (contractAddress: string) => {

    const contractSpecificEvents = tokenAllowances.filter(
      (ev: IFormattedLogEntry) => ev.tokenContract === contractAddress
    );

    if (contractSpecificEvents.length === 0) {
      return <NoSpenders>No third-party address is approved to spend this token</NoSpenders>;
    }

    // Sort by blocknumber desc
    contractSpecificEvents.sort((a: IFormattedLogEntry, b: IFormattedLogEntry) => a.blockNumber < b.blockNumber ? 1 : -1)
    // Return only the most recent log entry per 1 spender address
    const uniqueSpenders = [...new Map(contractSpecificEvents.map((logEvent: IFormattedLogEntry) => [logEvent.spender, logEvent])).values()];

    return (
      <ul>
        {uniqueSpenders.map((ev: IFormattedLogEntry, index: number) => {
          const { spender, allowance, decimals } = ev;
          return (
            <li key={index}>
              {formatAddress(spender)} can spend {formatAllowance(allowance, decimals)} tokens
            </li>
          );
        })}
      </ul>
    );
  };

  const tokenTable = {
    head: [
      translateRaw('TOKEN_ALLOWANCES_TABLE_TOKEN_INFO_HEADER'),
      translateRaw('TOKEN_ALLOWANCES_TABLE_SPENDER_INFO_HEADER')
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
