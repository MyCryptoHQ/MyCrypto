import React, { useContext } from 'react';

import { IReceiverAddress, Network } from '@types';
import { AddressBookContext, findNextRecipientLabel } from '@services/Store';

import GeneralLookupField, { IGeneralLookupFieldComponentProps } from './GeneralLookupField';

interface IContactLookupFieldComponentProps {
  network: Network;
  name: string;
  value: IReceiverAddress;
}

const ContactLookupField = ({
  network,
  name,
  value,
  ...rest
}: IContactLookupFieldComponentProps &
  Omit<IGeneralLookupFieldComponentProps, 'options' | 'handleEthAddress' | 'handleENSName'>) => {
  const {
    addressBook: contacts,
    createAddressBooks: createContact,
    getContactByAddress
  } = useContext(AddressBookContext);

  const handleEthAddress = (inputString: string): IReceiverAddress => {
    const contact = getContactByAddress(inputString);
    if (contact) return { display: contact.label, value: contact.address };

    const label = findNextRecipientLabel(contacts);
    createContact({
      address: inputString,
      label,
      notes: '',
      network: network.id
    });
    return {
      display: label,
      value: inputString
    };
  };

  const handleENSName = (resolvedAddress: string, inputString: string) => {
    const contact = getContactByAddress(resolvedAddress);
    if (contact) return { display: contact.label, value: contact.address };

    const [label] = inputString.split('.');
    createContact({
      address: resolvedAddress,
      label,
      notes: '',
      network: network.id
    });
    return {
      display: label,
      value: resolvedAddress
    };
  };

  return (
    <GeneralLookupField
      name={name}
      value={value}
      network={network}
      options={contacts}
      handleEthAddress={handleEthAddress}
      handleENSName={handleENSName}
      onLoad={(setFieldValue) => {
        if (value && value.value) {
          const contact = getContactByAddress(value.value);
          if (contact && value.display !== contact.label) {
            setFieldValue(name, { display: contact.label, value: contact.address }, true);
          }
        }
      }}
      {...rest}
    />
  );
};

export default ContactLookupField;
