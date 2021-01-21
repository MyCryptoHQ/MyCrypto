import React, { useState } from 'react';

import { Button, Identicon } from '@mycrypto/ui';
import cloneDeep from 'lodash/cloneDeep';
import isNumber from 'lodash/isNumber';
import styled, { css } from 'styled-components';

import {
  Box,
  DashboardPanel,
  EditableText,
  EthAddress,
  FixedSizeCollapsibleTable,
  Icon,
  Link,
  Network,
  RowDeleteOverlay,
  Text,
  Tooltip,
  UndoDeleteOverlay
} from '@components';
import IconArrow from '@components/IconArrow';
import { useNetworks } from '@services';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import { translateRaw } from '@translations';
import { ExtendedContact, TUuid } from '@types';

interface Props {
  contacts: ExtendedContact[];
  contactRestore: { [name: string]: ExtendedContact | undefined };
  toggleFlipped(): void;
  deleteContact(uuid: string): void;
  updateContact(addressBooksData: ExtendedContact): void;
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

const HeaderAlignment = styled.div`
  ${(props: { align?: string }) => css`
    @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
      text-align: ${props.align || 'inherit'};
    }
  `};
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

const breakpoint = 450;
export const screenIsMobileSized = (): boolean =>
  window.matchMedia(`(max-width: ${breakpoint}px)`).matches;

export default function AddressBook({
  contacts,
  contactRestore,
  toggleFlipped,
  deleteContact,
  updateContact,
  restoreDeletedContact
}: Props) {
  const { getNetworkById } = useNetworks();
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

  const convertColumnToClickable = (id: IColumnValues) =>
    screenIsMobileSized() ? (
      translateRaw(id)
    ) : (
      <Box key={id} onClick={() => updateSortingState(id)} variant="rowAlign">
        {translateRaw(id)} <IconArrow isFlipped={getColumnSortDirection(id)} />
      </Box>
    );

  const addressBookTable = {
    head: [
      convertColumnToClickable('ADDRESSBOOK_LABEL'),
      convertColumnToClickable('ADDRESSBOOK_ADDRESS'),
      translateRaw('ADDRESSBOOK_NETWORK'),
      translateRaw('ADDRESSBOOK_NOTES'),
      <HeaderAlignment key={'ADDRESSBOOK_REMOVE'} align="center">
        {translateRaw('ADDRESSBOOK_REMOVE')}
      </HeaderAlignment>
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
      ({ uuid, address, label, network, notes }: ExtendedContact, index) => {
        const networkData = getNetworkById(network);
        const color = networkData && networkData.color ? networkData.color : COLORS.LIGHT_PURPLE;
        return [
          // Eslint requires a key because it identifies a jsx element in an array.
          // CollapsibleTable uses an array for mobile display
          // When displayed as a row, the primary row key is provided by AbstractTable
          /* eslint-disable react/jsx-key */
          <Label>
            <SIdenticon address={address} />
            <SEditableText
              truncate={true}
              value={label}
              saveValue={(value) => updateContact({ address, label: value, network, notes, uuid })}
            />
          </Label>,
          <EthAddress address={address} truncate={true} isCopyable={true} />,
          <Network color={color}>{network}</Network>,
          <EditableText
            truncate={true}
            value={notes}
            saveValue={(value) => updateContact({ address, label: value, network, notes, uuid })}
          />,
          <DeleteButton onClick={() => setDeletingIndex(index)} icon="exit" />
          /* eslint-enable react/jsx-key */
        ];
      }
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
          {translateRaw('ADDRESSBOOK')}{' '}
          <Tooltip width="16px" tooltip={translateRaw('ADDRESS_BOOK_TOOLTIP')} />
        </>
      }
      headingRight={
        <Link>
          <Box variant="rowAlign" onClick={toggleFlipped}>
            <Icon type="add-bold" width="16px" />
            <Text ml={SPACING.XS} mb={0} color="BLUE_BRIGHT">
              {translateRaw('ADD')}
            </Text>
          </Box>
        </Link>
      }
    >
      <FixedSizeCollapsibleTable
        breakpoint={breakpoint}
        maxHeight={'450px'}
        {...addressBookTable}
      />
    </DashboardPanel>
  );
}
