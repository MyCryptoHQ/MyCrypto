import React, { useState, useEffect, useRef } from 'react';
import styled, { StyledFunction } from 'styled-components';
import { Button, Identicon } from '@mycrypto/ui';

import { translateRaw } from 'translations';
import { Checkbox } from 'v2/components';
import { ExtendedAccount, useOnClickOutside } from 'v2/services';
import { SCref } from 'v2/types/global';

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

const SButton = styled(Button)`
  height: 40px;
  width: 100%;
  padding: 9px 0;
  font-size: 18px;
  line-height: 18px;
  font-weight: bold;
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

const renderAccounts = (
  accounts: ExtendedAccount[],
  selected: string[],
  handleChange: (uuid: string) => void
) =>
  accounts.map(({ uuid, label, address }: ExtendedAccount) => (
    <Checkbox
      key={uuid}
      name={`account-${uuid}`}
      checked={selected.includes(uuid)}
      onChange={() => handleChange(uuid)}
      label={label}
      icon={() => <Identicon className="AccountDropdown-menu-identicon" address={address} />}
    />
  ));

const AccountDropdown = ({ accounts = [], selected = [], onSubmit }: AccountDropdownProps) => {
  const ref = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draftSelected, setDraftSelected] = useState<string[]>([]);

  useOnClickOutside(ref, () => setIsOpen(false));

  // Only update our draft if the prop changed.
  // https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects
  useEffect(() => setDraftSelected(selected), [selected]);

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
  };

  const toggleSingleAccount = (uuid: string) => {
    const changed = draftSelected.includes(uuid)
      ? draftSelected.filter(entry => entry !== uuid)
      : draftSelected.concat(uuid);
    setDraftSelected(changed);
  };

  return (
    <SDropdown ref={ref as SCref} role="button" onClick={toggleOpen} isOpen={isOpen}>
      {label}
      {isOpen && (
        <div onClick={e => e.stopPropagation()}>
          <Checkbox
            name="all-accounts"
            checked={allVisible}
            onChange={toggleAllAccounts}
            label={`${translateRaw('ACCOUNTS_DROPDOWN_ALL_WALLETS')}`}
          />
          <Divider />
          {renderAccounts(accounts, draftSelected, toggleSingleAccount)}
          <Divider />
          <SButton
            onClick={() => {
              onSubmit(draftSelected);
              toggleOpen();
            }}
          >
            {translateRaw('ACCOUNTS_DROPDOWN_ACTION')}
          </SButton>
        </div>
      )}
    </SDropdown>
  );
};

export default AccountDropdown;
