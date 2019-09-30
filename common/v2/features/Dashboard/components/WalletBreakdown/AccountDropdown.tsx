import React, { useEffect, useRef, useState, useContext } from 'react';
import { Icon, Identicon } from '@mycrypto/ui';
import styled, { StyledFunction } from 'styled-components';

import { translateRaw } from 'translations';
import { Checkbox } from 'v2/components';
import { useOnClickOutside, truncate } from 'v2/utils';
import { getLabelByAccount, AddressBookContext } from 'v2/services/Store';
import { COLORS } from 'v2/theme';
import { ExtendedAccount, ExtendedAddressBook } from 'v2/types';

const { BRIGHT_SKY_BLUE } = COLORS;

interface AccountDropdownProps {
  accounts: ExtendedAccount[];
  selected: string[];
  onSubmit(selected: string[]): void;
}

interface SDropdownProps {
  isOpen: boolean;
  ref: SCref;
}

const Divider = styled('div')`
  border-bottom: ${props => `1px solid ${props.theme.GAU.COLORS.dividerColor}`};
  margin-bottom: 15px;
`;

const dropdown: StyledFunction<SDropdownProps & React.HTMLProps<HTMLInputElement>> = styled('div');
const SDropdown = dropdown`
  display: flex;
  align-items: center;
  position: relative;
  height: 48px;
  padding: 9px 15px;
  border: ${props => `1px solid ${props.theme.GAU.COLORS.dividerColor}`};
  border-radius: 2px;
  background-color: #ffffff;
  cursor: pointer;

  ${props =>
    props.isOpen
      ? `{
    box-shadow: 0 7px 10px 5px rgba(50, 50, 93, 0.1), 0 3px 6px 0 rgba(0, 0, 0, 0.07);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }`
      : ''}

  & > div {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    left: -1px;                 // border-box isn't satisfying so we increase width and
    width: calc(100% + 2px);    // move to left to align the trigger and the dropdown.
    position: absolute;
    top: 100%;
    z-index: 2;
    padding: 15px 20px 14px 20px;
    background: #ffffff;
    border: 1px solid #e5ecf3;
    border-top: none;
    box-shadow: 0 7px 10px 5px rgba(50, 50, 93, 0.1);
  }
`;

const LabelRow = styled.span`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const IconWrapper = styled(Icon)`
  margin: 0;
  margin-left: 6px;
  font-size: 0.75rem;

  svg {
    color: ${BRIGHT_SKY_BLUE};
  }
`;

const renderAccounts = (
  accounts: ExtendedAccount[],
  selected: string[],
  addressBook: ExtendedAddressBook[],
  handleChange: (uuid: string) => void
) =>
  accounts.map((account: ExtendedAccount) => {
    const addressCard = getLabelByAccount(account, addressBook);
    const addressLabel = addressCard ? addressCard.label : 'Unknown Account';
    return (
      <Checkbox
        key={account.uuid}
        name={`account-${account.uuid}`}
        checked={selected.includes(account.uuid)}
        onChange={() => handleChange(account.uuid)}
        label={`${truncate(account.address)} - ${addressLabel}`}
        icon={() => (
          <Identicon className="AccountDropdown-menu-identicon" address={account.address} />
        )}
      />
    );
  });

const AccountDropdown = ({ accounts = [], selected = [], onSubmit }: AccountDropdownProps) => {
  const { addressBook } = useContext(AddressBookContext);
  const ref = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draftSelected, setDraftSelected] = useState<string[]>([]);

  useOnClickOutside(ref, () => setIsOpen(false));

  // Only update our draft if the prop changed.
  // https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects
  useEffect(() => setDraftSelected(selected), [selected, accounts]);

  const allVisible = accounts.length !== 0 && accounts.length === draftSelected.length;

  const label = allVisible
    ? translateRaw('ACCOUNTS_DROPDOWN_ALL_ACCOUNTS')
    : translateRaw('ACCOUNTS_DROPDOWN_SOME_WALLETS', {
        $current: `${draftSelected.length}`,
        $total: `${accounts.length}`
      });

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const toggleAllAccounts = () => {
    const changed = draftSelected.length < accounts.length ? accounts.map(a => a.uuid) : [];
    setDraftSelected(changed);
    onSubmit(changed);
  };

  const toggleSingleAccount = (uuid: string) => {
    const changed = draftSelected.includes(uuid)
      ? draftSelected.filter(entry => entry !== uuid)
      : draftSelected.concat(uuid);
    setDraftSelected(changed);
    onSubmit(changed);
  };

  return (
    <SDropdown ref={ref as SCref} role="button" onClick={toggleOpen} isOpen={isOpen}>
      <LabelRow>
        <span>{label}</span>
        <IconWrapper icon="navDownCaret" />
      </LabelRow>

      {isOpen && (
        <div onClick={e => e.stopPropagation()}>
          <Checkbox
            name="all-accounts"
            checked={allVisible}
            onChange={toggleAllAccounts}
            label={`${translateRaw('ACCOUNTS_DROPDOWN_ALL_WALLETS')}`}
          />
          <Divider />
          {renderAccounts(accounts, draftSelected, addressBook, toggleSingleAccount)}
          <Divider />
        </div>
      )}
    </SDropdown>
  );
};

export default AccountDropdown;
