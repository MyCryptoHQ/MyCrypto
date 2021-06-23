import { translateRaw } from '@translations';
import { Contract, IReceiverAddress, Network } from '@types';

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
      display: 'Contract',
      value: inputString
    };
  };

  const handleENSName = (resolvedAddress: string) => {
    return {
      display: 'Contract',
      value: resolvedAddress
    };
  };

  return (
    <GeneralLookupField
      name={name}
      value={value}
      network={network}
      options={contracts.map((c) => ({ label: c.name, ...c }))}
      handleEthAddress={handleEthAddress}
      handleENSName={handleENSName}
      placeholder={translateRaw('CONTRACT_SELECTION_PLACEHOLDER')}
      {...rest}
    />
  );
};

export default ContractLookupField;
