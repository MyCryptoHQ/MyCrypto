import { AnyAction, bindActionCreators, Dispatch } from '@reduxjs/toolkit';
import { connect, ConnectedProps } from 'react-redux';

import { createOrUpdateContact, updateUserActionStateByName } from '@store';
import { translateRaw } from '@translations';
import { ACTION_NAME, ACTION_STATE, ExtendedContact, NetworkId, TAddress } from '@types';

import EditableText from './EditableText';

interface OwnProps {
  addressBookEntry?: ExtendedContact;
  address: TAddress;
  networkId: NetworkId;
}

export const EditableAccountLabel = ({
  addressBookEntry,
  address,
  networkId,
  createOrUpdateContact,
  updateUserActionStateByName
}: Props) => {
  const handleChange = (value: string) => {
    const contact = {
      address,
      network: networkId,
      ...addressBookEntry,
      label: value
    };
    createOrUpdateContact(contact);
    if (addressBookEntry) {
      updateUserActionStateByName({
        name: ACTION_NAME.UPDATE_LABEL,
        state: ACTION_STATE.COMPLETED
      });
    }
  };

  return (
    <EditableText
      bold={true}
      truncate={true}
      onChange={handleChange}
      value={addressBookEntry ? addressBookEntry.label : translateRaw('NO_LABEL')}
    />
  );
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ createOrUpdateContact, updateUserActionStateByName }, dispatch);

const connector = connect(() => ({}), mapDispatchToProps);
type Props = ConnectedProps<typeof connector> & OwnProps;

export default connector(EditableAccountLabel);
