import React, { useState } from 'react';

import { Button, Icon, Identicon } from '@mycrypto/ui';
import cloneDeep from 'lodash/cloneDeep';
import isNumber from 'lodash/isNumber';
import styled from 'styled-components';

import {
  DashboardPanel,
  EditableText,
  EthAddress,
  FixedSizeCollapsibleTable,
  Network,
  RowDeleteOverlay,
  Tooltip,
  UndoDeleteOverlay
} from '@components';
import IconArrow from '@components/IconArrow';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import { translateRaw } from '@translations';
import { ExtendedContact, Contact as IContact, TUuid } from '@types';

interface Props {
  contacts: ExtendedContact[];
  contactRestore: { [name: string]: ExtendedContact | undefined };
  toggleFlipped(): void;
  deleteContact(uuid: string): void;
  updateContact(uuid: string, addressBooksData: IContact): void;
  restoreDeletedContact(id: TUuid): void;
}

const DeleteButton = styled(Button)`
  align-items: center;
  align-self: flex-end;
  display: flex;
  font-size: 0.7em;
  justify-content: center;
  width: 100%;
`;

const AddAccountButton = styled(Button)`
  color: ${COLORS.BLUE_BRIGHT};
  padding: ${SPACING.BASE};
  opacity: 1;
  &:hover {
    transition: 200ms ease all;
    transform: scale(1.02);
    opacity: 0.7;
  }
`;

const BottomRow = styled.div`
  text-align: center;
  background: ${COLORS.BLUE_GREY_LIGHTEST};
`;

const Label = styled.span`
  display: flex;
  align-items: center;
`;

const SIdenticon = styled(Identicon)`
  > img {
    height: 2em;
  }
  margin-right: ${SPACING.SM};
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin-right: ${SPACING.MD};
  }
`;

const SEditableText = styled(EditableText)`
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    font-weight: inherit;
  }
`;

type ISortTypes = 'label' | 'label-reverse' | 'address' | 'address-reverse';
type IColumnValues = 'ADDRESSBOOK_LABEL' | 'ADDRESSBOOK_ADDRESS';

export interface ISortingState {
  sortState: {
    ADDRESSBOOK_LABEL: 'label' | 'label-reverse';
    ADDRESSBOOK_ADDRESS: 'address' | 'address-reverse';
  };
  activeSort: ISortTypes;
}

const initialSortingState: ISortingState = {
  sortState: {
    ADDRESSBOOK_LABEL: 'label',
    ADDRESSBOOK_ADDRESS: 'address'
  },
  activeSort: 'label'
};

interface ITableFullContactType {
  label: string;
  address: string;
}

type TSortFunction = (a: ITableFullContactType, b: ITableFullContactType) => number;

const getSortingFunction = (sortKey: ISortTypes): TSortFunction => {
  switch (sortKey) {
    case 'label':
      return (a: ITableFullContactType, b: ITableFullContactType) => a.label.localeCompare(b.label);
    case 'label-reverse':
      return (a: ITableFullContactType, b: ITableFullContactType) => b.label.localeCompare(a.label);
    case 'address':
      return (a: ITableFullContactType, b: ITableFullContactType) =>
        a.address.localeCompare(b.address);
    case 'address-reverse':
      return (a: ITableFullContactType, b: ITableFullContactType) =>
        b.address.localeCompare(a.address);
  }
};

export default function AddressBook({
  contacts,
  contactRestore,
  toggleFlipped,
  deleteContact,
  updateContact,
  restoreDeletedContact
}: Props) {
  const [sortingState, setSortingState] = useState(initialSortingState);
  const [deletingIndex, setDeletingIndex] = useState<number>();
  const [undoDeletingIndexes, setUndoDeletingIndexes] = useState<[number, TUuid][]>([]);
  const overlayRows: [number[], [number, TUuid][]] = [
    isNumber(deletingIndex) ? [deletingIndex] : [],
    [...undoDeletingIndexes]
  ];
  const overlayRowsFlat = [...overlayRows[0], ...overlayRows[1].map((row) => row[0])];

  const getDisplayAddressBook = (): ExtendedContact[] => {
    const accountsTemp = cloneDeep(contacts);
    overlayRows[1]
      .sort((a, b) => a[0] - b[0])
      .forEach((index) => {
        accountsTemp.splice(index[0], 0, contactRestore[index[1]] as ExtendedContact);
      });
    return accountsTemp.sort((a, b) => a.uuid.localeCompare(b.uuid));
  };
  const displayAddressBook = getDisplayAddressBook().sort(
    getSortingFunction(sortingState.activeSort)
  );

  const updateSortingState = (id: IColumnValues) => {
    // In case overlay active, disable changing sorting state
    if (overlayRowsFlat.length) return;

    const currentBtnState = sortingState.sortState[id];
    if (currentBtnState.indexOf('-reverse') > -1) {
      const newActiveSort = currentBtnState.split('-reverse')[0] as ISortTypes;
      setSortingState({
        sortState: {
          ...sortingState.sortState,
          [id]: newActiveSort
        },
        activeSort: newActiveSort
      });
    } else {
      const newActiveSort = (currentBtnState + '-reverse') as ISortTypes;
      setSortingState({
        sortState: {
          ...sortingState.sortState,
          [id]: newActiveSort
        },
        activeSort: newActiveSort
      });
    }
  };

  const getColumnSortDirection = (id: IColumnValues): boolean =>
    sortingState.sortState[id].indexOf('-reverse') > -1;

  const convertColumnToClickable = (id: IColumnValues) => (
    <div key={id} onClick={() => updateSortingState(id)}>
      {translateRaw(id)} <IconArrow isFlipped={getColumnSortDirection(id)} />
    </div>
  );

  const addressBookTable = {
    head: [
      translateRaw('ADDRESSBOOK_FAVORITE'),
      convertColumnToClickable('ADDRESSBOOK_LABEL'),
      convertColumnToClickable('ADDRESSBOOK_ADDRESS'),
      translateRaw('ADDRESSBOOK_NETWORK'),
      translateRaw('ADDRESSBOOK_NOTES'),
      translateRaw('ADDRESSBOOK_REMOVE')
    ],
    overlay: (rowIndex: number): JSX.Element => {
      if (!overlayRows) return <></>;

      if (overlayRows[0].length && overlayRows[0][0] === rowIndex) {
        // Row delete overlay
        const { uuid, label } = displayAddressBook[rowIndex];
        return (
          <RowDeleteOverlay
            prompt={translateRaw('ADDRESS_BOOK_REMOVE_OVERLAY_TEXT', {
              $label: label
            })}
            deleteAction={() => {
              setDeletingIndex(undefined);
              setUndoDeletingIndexes((prev) => [...prev, [rowIndex, uuid]]);
              deleteContact(uuid);
            }}
            cancelAction={() => setDeletingIndex(undefined)}
          />
        );
      } else if (overlayRows[1].length && overlayRows[1].map((row) => row[0]).includes(rowIndex)) {
        // Undo delete overlay
        const { uuid, label, address } = displayAddressBook[rowIndex];

        return (
          <UndoDeleteOverlay
            address={address}
            overlayText={translateRaw('ADDRESS_BOOK_UNDO_REMOVE_OVERLAY_TEXT', {
              $label: label
            })}
            restoreAccount={() => {
              restoreDeletedContact(uuid);
              setUndoDeletingIndexes((prev) => prev.filter((i) => i[0] !== rowIndex));
            }}
          />
        );
      }

      return <></>;
    },
    overlayRows: overlayRowsFlat,
    body: displayAddressBook.map(
      ({ uuid, address, label, network, notes }: ExtendedContact, index) => [
        <Icon key={0} icon="star" />,
        <Label key={1}>
          <SIdenticon address={address} />
          <SEditableText
            truncate={true}
            value={label}
            saveValue={(value) => updateContact(uuid, { address, label: value, network, notes })}
          />
        </Label>,
        <EthAddress key={2} address={address} truncate={true} isCopyable={true} />,
        <Network key={3} color="#a682ff">
          {network}
        </Network>,
        <EditableText
          key={4}
          truncate={true}
          value={notes}
          saveValue={(value) => updateContact(uuid, { address, label, network, notes: value })}
        />,
        <DeleteButton key={5} onClick={() => setDeletingIndex(index)} icon="exit" />
      ]
    ),
    config: {
      primaryColumn: translateRaw('ADDRESSBOOK_LABEL'),
      hiddenHeadings: [translateRaw('ADDRESSBOOK_FAVORITE'), translateRaw('ADDRESSBOOK_REMOVE')],
      iconColumns: [translateRaw('ADDRESSBOOK_FAVORITE'), translateRaw('ADDRESSBOOK_REMOVE')]
    }
  };
  return (
    <DashboardPanel
      heading={
        <>
          {translateRaw('ADDRESSBOOK')} <Tooltip tooltip={translateRaw('ADDRESS_BOOK_TOOLTIP')} />
        </>
      }
    >
      <FixedSizeCollapsibleTable breakpoint={450} maxHeight={'450px'} {...addressBookTable} />
      <BottomRow>
        <AddAccountButton onClick={toggleFlipped} basic={true}>
          {`+ ${translateRaw('ADDRESS_BOOK_TABLE_ADD_ADDRESS')}`}
        </AddAccountButton>
      </BottomRow>
    </DashboardPanel>
  );
}
