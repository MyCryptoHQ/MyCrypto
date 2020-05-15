import React from 'react';

import { Network, IReceiverAddress, Contract } from '@types';

import GenericLookupField, { IGenericLookupFieldComponentProps } from './GenericLookupField';

interface IContractLookupFieldComponentProps {
  network: Network;
  name: string;
  value: IReceiverAddress;
  contracts: Contract[];
}

const ContractLookupField = ({
  contracts,
  network,
  name,
  value,
  ...rest
}: IContractLookupFieldComponentProps & Omit<IGenericLookupFieldComponentProps, "options" | "handleEthAddress" | "handleENSName" | "setIsResolvingDomain">) => {
  const handleEthAddress = (inputString: string): IReceiverAddress => {
    return {
      display: inputString,
      value: inputString
    };
  };

  const handleENSname = (resolvedAddress: string, inputString: string) => {
    return {
      display: inputString,
      value: resolvedAddress
    };
  };

  return (
    <GenericLookupField
      name={name}
      value={value}
      network={network}
      options={contracts}
      handleEthAddress={handleEthAddress}
      handleENSname={handleENSname}
      {...rest}
    />
  );
};

export default ContractLookupField;
