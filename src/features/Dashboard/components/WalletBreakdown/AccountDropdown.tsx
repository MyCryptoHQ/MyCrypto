import React, { useEffect, useRef, useState, useContext } from 'react';
import { Icon, Identicon } from '@mycrypto/ui';
import styled from 'styled-components';

import { translateRaw } from '@translations';
import { Checkbox } from '@components';
import { useOnClickOutside, truncate, trimEllipsis } from '@utils';
import { getLabelByAccount, AddressBookContext } from '@services/Store';
import { COLORS } from '@theme';
import { IAccount, ExtendedAddressBook, TUuid } from '@types';

const { BLUE_BRIGHT, BLUE_LIGHT, GREY_LIGHTEST } = COLORS;

interface AccountDropdownProps {
  className?: string;
  accounts: IAccount[];
  selected: TUuid[];
  onSubmit(selected: TUuid[]): void;
}

interface SDropdownProps {
  isOpen: boolean;
  ref: SCref;
}

const Divider = styled('div')`
  border-bottom: ${(props) => `1px solid ${props.theme.GAU.COLORS.dividerColor}`};
  margin: 0px 20px 15px;
`;

const SDropdown = styled('div')<SDropdownProps>`
  display: flex;
  align-items: center;
  position: relative;
  height: 48px;
  padding: 9px 15px;
  border: ${(props) => `1px solid ${props.theme.GAU.COLORS.dividerColor}`};
  border-radius: 2px;
  background-color: #ffffff;
  cursor: pointer;

  ${(props) =>
    props.isOpen &&
    `{
    box-shadow: 0 7px 10px 5px rgba(50, 50, 93, 0.1), 0 3px 6px 0 rgba(0, 0, 0, 0.07);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border: 2px solid ${BLUE_LIGHT};
    padding: 8px 14px;
  }`}

  & > div {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    left: -2px; /* border-box isn't satisfying so we increase width and */
    width: calc(100% + 4px); /* move to left to align the trigger and the dropdown. */
    position: absolute;
    top: 100%;
    z-index: 5;
    background: #ffffff;
    border: 2px solid ${BLUE_LIGHT};
    border-top: none;
    box-shadow: 0 7px 10px 5px rgba(50, 50, 93, 0.1);
  }

  &:hover {
    border: 2px solid ${BLUE_LIGHT};
    padding: 8px 14px;
  }
`;

const LabelRow = styled.span`
  width: 100%;
  display: flex;
  justify-content: space-between;
  min-width: 20px;
`;

const IconWrapper = styled(Icon)`
  margin: 0;
  margin-left: 6px;
  font-size: 0.75rem;

  svg {
    color: ${BLUE_BRIGHT};
  }
`;

const SCheckbox = styled(Checkbox)`
  padding: 5px 20px 5px 20px;
  height: 50px;
  margin-bottom: 0px;

  &:hover {
    background-color: ${GREY_LIGHTEST};
  }

  > label {
    min-width: 20px;
  }

  img {
    min-width: 30px;
  }
`;

const renderAccounts = (
  accounts: IAccount[],
  selected: string[],
  addressBook: ExtendedAddressBook[],
  handleChange: (uuid: string) => void
) =>
  accounts.map((account: IAccount) => {
    const addressCard = getLabelByAccount(account, addressBook);
    const addressLabel = addressCard ? addressCard.label : translateRaw('NO_LABEL');
    return (
      <SCheckbox
        key={account.uuid}
        name={`account-${account.uuid}`}
        checked={selected.includes(account.uuid)}
        onChange={() => handleChange(account.uuid)}
        label={`${truncate(account.address)} - ${trimEllipsis(addressLabel, 65)}`}
        icon={() => (
          <Identicon className="AccountDropdown-menu-identicon" address={account.address} />
        )}
      />
    );
  });

const AccountDropdown = ({
  accounts = [],
  selected = [],
  onSubmit,
  ...props
}: AccountDropdownProps) => {
  const { addressBook } = useContext(AddressBookContext);
  const ref = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draftSelected, setDraftSelected] = useState<TUuid[]>([]);

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
    const changed = draftSelected.length < accounts.length ? accounts.map((a) => a.uuid) : [];
    setDraftSelected(changed);
    onSubmit(changed);
  };

  const toggleSingleAccount = (uuid: TUuid) => {
    const changed = draftSelected.includes(uuid)
      ? draftSelected.filter((entry) => entry !== uuid)
      : draftSelected.concat([uuid]);
    setDraftSelected(changed);
    onSubmit(changed);
  };

  return (
    <SDropdown ref={ref as SCref} role="button" onClick={toggleOpen} isOpen={isOpen} {...props}>
      <LabelRow>
        <span>{label}</span>
        <IconWrapper icon="navDownCaret" />
      </LabelRow>

      {isOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <SCheckbox
            name="all-accounts"
            checked={allVisible}
            onChange={toggleAllAccounts}
            label={`${translateRaw('ACCOUNTS_DROPDOWN_ALL_ACCOUNTS')}`}
          />
          <Divider />
          {renderAccounts(accounts, draftSelected, addressBook, toggleSingleAccount)}
        </div>
      )}
    </SDropdown>
  );
};

export default AccountDropdown;
