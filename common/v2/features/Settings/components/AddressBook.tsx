import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon, Identicon, Button } from '@mycrypto/ui';
import isNumber from 'lodash/isNumber';
import cloneDeep from 'lodash/cloneDeep';

import {
  DashboardPanel,
  CollapsibleTable,
  RowDeleteOverlay,
  Network,
  EthAddress,
  EditableText,
  Tooltip,
  UndoDeleteOverlay
} from 'v2/components';
import { ExtendedAddressBook, AddressBook as IAddressBook, TUuid } from 'v2/types';
import { truncate } from 'v2/utils';
import { COLORS, SPACING, BREAK_POINTS } from 'v2/theme';
import { translateRaw } from 'v2/translations';

interface Props {
  addressBook: ExtendedAddressBook[];
  addressBookRestore: { [name: string]: ExtendedAddressBook | undefined };
  toggleFlipped(): void;
  deleteAddressBooks(uuid: string): void;
  updateAddressBooks(uuid: string, addressBooksData: IAddressBook): void;
  restoreDeletedAddressBook(addressBookId: TUuid): void;
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

export default function AddressBook({
  addressBook,
  addressBookRestore,
  toggleFlipped,
  deleteAddressBooks,
  updateAddressBooks,
  restoreDeletedAddressBook
}: Props) {
  const [deletingIndex, setDeletingIndex] = useState<number>();
  const [undoDeletingIndexes, setUndoDeletingIndexes] = useState<[number, TUuid][]>([]);
  const overlayRows: [number[], [number, TUuid][]] = [
    isNumber(deletingIndex) ? [deletingIndex] : [],
    [...undoDeletingIndexes]
  ];
  const overlayRowsFlat = [...overlayRows[0], ...overlayRows[1].map((row) => row[0])];

  const getDisplayAddressBook = (): ExtendedAddressBook[] => {
    const accountsTemp = cloneDeep(addressBook);
    overlayRows[1]
      .sort((a, b) => a[0] - b[0])
      .forEach((index) => {
        accountsTemp.splice(index[0], 0, addressBookRestore[index[1]] as ExtendedAddressBook);
      });
    return accountsTemp.sort((a, b) => a.uuid.localeCompare(b.uuid));
  };
  const displayAddressBook = getDisplayAddressBook();

  const addressBookTable = {
    head: [
      translateRaw('ADDRESSBOOK_FAVORITE') || 'Favorite',
      translateRaw('ADDRESSBOOK_LABEL') || 'Label',
      translateRaw('ADDRESSBOOK_ADDRESS'),
      translateRaw('ADDRESSBOOK_NETWORK'),
      translateRaw('ADDRESSBOOK_NOTES'),
      translateRaw('ADDRESSBOOK_DELETE') || 'Delete'
    ],
    overlay: (rowIndex: number): JSX.Element => {
      if (!overlayRows) return <></>;

      if (overlayRows[0].length && overlayRows[0][0] === rowIndex) {
        // Row delete overlay
        const { uuid, label } = displayAddressBook[rowIndex];
        return (
          <RowDeleteOverlay
            prompt={translateRaw('ADDRESS_BOOK_DELETE_OVERLAY_TEXT', {
              $label: label
            })}
            deleteAction={() => {
              setDeletingIndex(undefined);
              setUndoDeletingIndexes((prev) => [...prev, [rowIndex, uuid]]);
              deleteAddressBooks(uuid);
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
            overlayText={translateRaw('ADDRESS_BOOK_UNDO_DELETE_OVERLAY_TEXT', {
              $label: label
            })}
            restoreAccount={() => {
              restoreDeletedAddressBook(uuid);
              setUndoDeletingIndexes((prev) => prev.filter((i) => i[0] !== rowIndex));
            }}
          />
        );
      }

      return <></>;
    },
    overlayRows: overlayRowsFlat,
    body: displayAddressBook.map(
      ({ uuid, address, label, network, notes }: ExtendedAddressBook, index) => [
        <Icon key={0} icon="star" />,
        <Label key={1}>
          <SIdenticon address={address} />
          <SEditableText
            truncate={true}
            value={label}
            saveValue={(value) =>
              updateAddressBooks(uuid, { address, label: value, network, notes })
            }
          />
        </Label>,
        <EthAddress key={2} address={address} truncate={truncate} isCopyable={true} />,
        <Network key={3} color="#a682ff">
          {network}
        </Network>,
        <EditableText
          key={4}
          truncate={true}
          value={notes}
          saveValue={(value) => updateAddressBooks(uuid, { address, label, network, notes: value })}
        />,
        <DeleteButton key={5} onClick={() => setDeletingIndex(index)} icon="exit" />
      ]
    ),
    config: {
      primaryColumn: translateRaw('ADDRESSBOOK_LABEL'),
      sortableColumn: overlayRowsFlat.length ? '' : translateRaw('ADDRESSBOOK_LABEL'),
      sortFunction: () => (a: any, b: any) => {
        const aLabel = a.props.label;
        const bLabel = b.props.label;
        return aLabel === bLabel ? true : aLabel.localeCompare(bLabel);
      },
      hiddenHeadings: [
        translateRaw('ADDRESSBOOK_FAVORITE'),
        translateRaw('ADDRESSBOOK_DELETE')
      ],
      iconColumns: [
        translateRaw('ADDRESSBOOK_FAVORITE'),
        translateRaw('ADDRESSBOOK_DELETE')
      ]
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
      <CollapsibleTable breakpoint={450} {...addressBookTable} />
      <BottomRow>
        <AddAccountButton onClick={toggleFlipped} basic={true}>
          {`+ ${translateRaw('ADDRESS_BOOK_TABLE_ADD_ADDRESS')}`}
        </AddAccountButton>
      </BottomRow>
    </DashboardPanel>
  );
}
