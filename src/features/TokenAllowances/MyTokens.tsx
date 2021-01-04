import React, { useEffect, useState } from 'react';

import { Button } from '@mycrypto/ui';
import { bigNumberify } from 'ethers/utils';
import styled from 'styled-components';

import { FixedSizeCollapsibleTable } from '@components';
import { Contracts } from '@database';
import { ProviderHandler } from '@services';
import { BREAK_POINTS, breakpointToNumber } from '@theme';
import { translateRaw } from '@translations';
import { Network } from '@types';
import { weiToFloat } from '@utils';


import { IFormattedLogEntry, MyTokensProps } from './types';

const RowAlignment = styled.div`
  float: ${(props: { align?: string }) => props.align || 'inherit'};
`;
const NoSpenders = styled.span`
  text-decoration: italic;
  color: #d4d4d4;
`;

const AllowanceListContainer = styled.div`
  width: 100%;
  display: inherit;
`;
const AllowanceListItem = styled.div`
  display: block;
  width: 100%;
  padding: 0.5em 0;
`;
const DeleteButton = styled(Button)`
  display: inline-block;
  padding: 0.5em;
  margin: 0 0 0 0.5em;
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

          setTokenAllowances((tokenAllowances: IFormattedLogEntry[]) => [
            ...tokenAllowances,
            formattedLog
          ]);
        });
      })
    );
  };

  const formatAllowance = (allowance: string, decimals: number) => {
    // @todo - get the totalSupply of the contract also
    if (allowance === [`0x`, `f`.repeat(64)].join('')) {
      return `Unlimited`;
    }

    return weiToFloat(bigNumberify(allowance), decimals).toFixed(0);
  };

  const formatAddress = (address: string) => {
    const addr = `0x` + address.substr(address.length - 40);

    const namedContract = Contracts.Ethereum.filter(
      (contract) => contract.address.toLowerCase() === address.toLowerCase()
    );
    if (namedContract.length > 0) {
      //@todo - make this link out to the block explorer?
      return namedContract[0].name;
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
    contractSpecificEvents.sort((a: IFormattedLogEntry, b: IFormattedLogEntry) =>
      a.blockNumber < b.blockNumber ? 1 : -1
    );
    // Return only the most recent log entry per 1 spender address
    const uniqueSpenders = [
      ...new Map(
        contractSpecificEvents.map((logEvent: IFormattedLogEntry) => [logEvent.spender, logEvent])
      ).values()
    ];

    return (
      <AllowanceListContainer>
        {uniqueSpenders.map((ev: IFormattedLogEntry, index: number) => {
          const { spender, allowance, decimals } = ev;
          return (
            <AllowanceListItem key={index}>
              {formatAddress(spender)} can spend {formatAllowance(allowance, decimals)} tokens
              <DeleteButton key={index} onClick={() => console.log(index)}>
                Revoke
              </DeleteButton>
            </AllowanceListItem>
          );
        })}
      </AllowanceListContainer>
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
    <>
      <p>Viewing token allowances for address {address}</p>
      <FixedSizeCollapsibleTable
        breakpoint={breakpointToNumber(BREAK_POINTS.SCREEN_XS)}
        {...tokenTable}
      />
    </>
  );
}
