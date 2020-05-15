import React from 'react';

import { Network, IReceiverAddress, Contract } from '@types';

import GeneralLookupField, { IGeneralLookupFieldComponentProps } from './GeneralLookupField';

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
}: IContractLookupFieldComponentProps &
  Omit<IGeneralLookupFieldComponentProps, 'options' | 'handleEthAddress' | 'handleENSName'>) => {
  const handleEthAddress = (inputString: string): IReceiverAddress => {
    return {
      display: inputString,
      value: inputString
    };
  };

  const handleENSName = (resolvedAddress: string, inputString: string) => {
    return {
      display: inputString,
      value: resolvedAddress
    };
  };

  return (
    <GeneralLookupField
      name={name}
      value={value}
      network={network}
      options={contracts}
      handleEthAddress={handleEthAddress}
      handleENSName={handleENSName}
      {...rest}
    />
  );
};

export default ContractLookupField;
