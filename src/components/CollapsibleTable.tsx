/*
  Imported and modified from @mycrypto/ui to style headers
  In order to style the headers particularyly the Icon caret
*/

import { ComponentProps, ReactNode, useState } from 'react';

import styled from 'styled-components';

import { useScreenSize } from '@utils';

import { default as Box } from './Box';
import { default as Icon } from './Icon';
import { Text } from './NewTypography';
import { StackedCard } from './StackedCard';
import { Table, TableConfig, TableData } from './Table';

type StackedCardData = ComponentProps<typeof StackedCard>;

type CollapsibleTableData = TableData & {
  config: TableConfig & {
    primaryColumn: string;
    iconColumns?: string[];
  };
};

interface CollapsedGroups {
  [title: string]: boolean;
}

const StackedCardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

export const transformRowToCards = (
  row: ReactNode[],
  head: (string | JSX.Element)[],
  primaryColumnIndex: number,
  iconColumns: string[] = []
): StackedCardData =>
  row.reduce(
    (prev: StackedCardData, next, index) => {
      const label = head[index];

      if (index === primaryColumnIndex && !iconColumns) {
        prev.heading = next;
      } else if (iconColumns.includes(label as string)) {
        prev.icons!.push(next);
      } else {
        prev.entries.push([label, next]);
      }

      return prev;
    },
    {
      heading: '',
      entries: [],
      icons: []
    }
  );

export const transformTableToCards = (
  { head, body, groups = [], config }: CollapsibleTableData,
  collapsedGroups: CollapsedGroups = {}
): (StackedCardData | string)[] => {
  const { primaryColumn, iconColumns } = config;
  const primaryColumnIndex = head.indexOf(primaryColumn);
  const cards: (StackedCardData | string)[] = body.map((row) =>
    transformRowToCards(row, head, primaryColumnIndex, iconColumns)
  );

  groups.forEach(({ title, entries }) =>
    cards.push(
      title,
      ...(collapsedGroups[title]
        ? []
        : entries.map((row) => transformRowToCards(row, head, primaryColumnIndex, iconColumns)))
    )
  );

  return cards;
};

export const CollapsibleTable = ({
  overlay: Overlay,
  overlayRows,
  ...props
}: CollapsibleTableData & { breakpoint?: number }) => {
  const { isMobile } = useScreenSize();
  const [collapsedGroups, setCollapsedGroups] = useState<CollapsedGroups>({});

  const toggleCollapseGroup = (title: string) =>
    setCollapsedGroups({
      ...collapsedGroups,
      [title]: !collapsedGroups[title]
    });

  return (
    <>
      {isMobile ? (
        transformTableToCards(props, collapsedGroups).map((cardData, index) =>
          typeof cardData === 'string' ? (
            // The element being iterated on is a group heading.
            <Box
              key={index}
              as="section"
              variant="rowAlign"
              padding="16px"
              role="button"
              backgroundColor="tableHeadBackground"
              onClick={() => toggleCollapseGroup(cardData)}
            >
              <Text as="span" textTransform="uppercase">
                {cardData}
              </Text>
              <Icon
                ml="0.5ch"
                type="expandable"
                isExpanded={!collapsedGroups[cardData]}
                height="1em"
              />
            </Box>
          ) : (
            // The element being iterated on is table data.
            <Box key={index} position="relative">
              <StackedCard {...cardData} />
              {Overlay && overlayRows!.includes(index) && (
                <StackedCardOverlay>
                  <Overlay indexKey={index} />
                </StackedCardOverlay>
              )}
            </Box>
          )
        )
      ) : (
        <Table {...props} overlay={Overlay} overlayRows={overlayRows} />
      )}
    </>
  );
};

export default CollapsibleTable;
