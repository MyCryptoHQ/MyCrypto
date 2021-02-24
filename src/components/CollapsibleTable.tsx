/*
  Imported and modified from @mycrypto/ui to style headers
  In order to style the headers particularyly the Icon caret
*/

import React, { ReactNode, useState } from 'react';

import { scale, StackedCardData, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { useScreenSize } from '@utils';

import { default as Box } from './Box';
import { default as Icon } from './Icon';
import { Text } from './NewTypography';
import { StackedCard } from './StackedCard';
import { Table, TableConfig, TableData } from './Table';

export enum CollapsibleTableModes {
  Mobile,
  Desktop
}

export interface CollapsibleTableConfig extends TableConfig {
  primaryColumn: string;
  iconColumns?: string[];
}

export interface CollapsibleTableData extends TableData {
  config: CollapsibleTableConfig;
}

interface CollapsedGroups {
  [title: string]: boolean;
}

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

const GroupHeading = styled(Typography)`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0.9375rem;
  border-bottom: 0.0625rem solid #dde3ee;
  background: ${(props) => props.theme.tableHeadBackground};
  text-transform: uppercase;
  font-size: ${scale(1)};
  cursor: pointer;
  z-index: 3;
`;

GroupHeading.defaultProps = {
  as: 'section',
  role: 'button'
};

const StackedCardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

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
            <React.Fragment key={index}>
              <StackedCard {...cardData} />
              {Overlay && overlayRows!.includes(index) && (
                <StackedCardOverlay>
                  <Overlay indexKey={index} />
                </StackedCardOverlay>
              )}
            </React.Fragment>
          )
        )
      ) : (
        <Table {...props} />
      )}
    </>
  );
};

export default CollapsibleTable;
